import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../db/client.js";
import { resetDatabase } from "../../test-utils/fixtures.js";

beforeEach(async () => {
    await resetDatabase();
});

afterAll(async () => {
    await prisma.$disconnect();
});

test("full flow: register and log in (US-01)", async () => {
    const credentials = {
        email: "alice@example.com",
        displayName: "Alice",
        password: "correcthorse",
    };

    // Arrange + Act: register a real user
    const registerRes = await request(app)
        .post("/api/auth/register")
        .send(credentials);

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.user.email).toBe(credentials.email);
    expect(registerRes.body.accessToken).toBeTruthy();

    // Act: log in with the same credentials
    const loginRes = await request(app)
        .post("/api/auth/login")
        .send({
            email: credentials.email,
            password: credentials.password,
        });

    // Assert: login succeeds and returns the registered user's account
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.user.id).toBe(registerRes.body.user.id);
    expect(loginRes.body.accessToken).toBeTruthy();
});
