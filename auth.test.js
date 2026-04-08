process.env.NODE_ENV = 'test';

const request = require("supertest")
const app = require("./app")
const User = require("./models/User")

// Mock the User model
jest.mock("./models/User")

describe("Auth Test", ()=> {

    beforeEach(() => {
        // Reset mocks before each test
        User.findOne.mockClear()
        User.mockClear()
    })

    it("should register user", async () => {
        // Mock User.findOne to return null (user doesn't exist)
        User.findOne = jest.fn().mockResolvedValue(null)
        
        // Mock User constructor and save method
        User.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue({ _id: "123456" })
        }))

        const res = await request(app)
            .post("/auth/register")
            .type('form')
            .send({username: "usertest", password: "12345678"});

        expect(res.statusCode).toBe(302);
    });
});

