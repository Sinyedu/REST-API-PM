import { loginUser, registerUser } from "../../controllers/authController";
import { UserModel } from "../../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectToDatabase, disconnectFromDatabase } from "../../repository/database";

jest.mock("../../models/userModel");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../repository/database");

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loginUser", () => {
    it("should return 400 if validation fails", async () => {
      const req: any = {
        body: { email: "bad", password: "123" },
      };
      const res = mockResponse();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 401 if user not found", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      const req: any = {
        body: {
          username: "test",
          email: "test@test.com",
          password: "password123",
        },
      };
      const res = mockResponse();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 401 if password is incorrect", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue({
        password: "hashed",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const req: any = {
        body: {
          username: "test",
          email: "test@test.com",
          password: "wrongpass",
        },
      };
      const res = mockResponse();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 200 and token on success", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue({
        id: "123",
        username: "test",
        email: "test@test.com",
        password: "hashed",
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("fake-token");

      const req: any = {
        body: {
          username: "test",
          email: "test@test.com",
          password: "password123",
        },
      };

      const res = mockResponse();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        token: "fake-token",
      });
    });
  });

  describe("registerUser", () => {
    it("should return 409 if email already exists", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(true);

      const req: any = {
        body: {
          username: "test",
          email: "test@test.com",
          password: "password123",
        },
      };

      const res = mockResponse();

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });

    it("should create user and return 201", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");

      const saveMock = jest.fn().mockResolvedValue({
        id: "123",
        email: "test@test.com",
      });

      (UserModel as any).mockImplementation(() => ({
        save: saveMock,
      }));

      const req: any = {
        body: {
          username: "test",
          email: "test@test.com",
          password: "password123",
        },
      };

      const res = mockResponse();

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});
