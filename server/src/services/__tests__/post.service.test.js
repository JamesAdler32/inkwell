import { jest } from "@jest/globals";

const mockPostRepository = {
    createWithTags: jest.fn(),
    searchPublished: jest.fn()
};
const mockEventBus = { emit: jest.fn() };

jest.unstable_mockModule("../../repositories/post.repository.js", () => ({
    PostRepository: mockPostRepository,
}));

jest.unstable_mockModule("../../events/event-bus.js", () => ({
    EventBus: mockEventBus,
}));

const { PostService } = await import("../post.service.js");

test("publish() creates a PUBLISHED post and emits post.published", async () => {
    mockPostRepository.createWithTags.mockResolvedValue({ id: "p1", title: "Hello", status: "PUBLISHED" });

    const post = await PostService.publish({ authorId: "u1", title: "Hello", body: "World" });
    expect(post.status).toBe("PUBLISHED");
    expect(mockEventBus.emit).toHaveBeenCalledWith(
        "post.published",
        expect.objectContaining({ postId: "p1" })
    );
});

test("publish() rejects an empty title", async () => {
    await expect(
        PostService.publish({ authorId: "u1", title: "", body: "World" })
    ).rejects.toThrow();
});

describe('search pagination logic', () => {
    const mockArgs = { query: 'test', page: 1, pageSize: 5 };

    it("search() returns nothing when there are no posts", async () => {
        await expect(
            PostService.search({ query: "", page: 0, pageSize: 10 })
        ), expect.objectContaining({ posts: [], hasMore: false });
    });

    it('should return posts and hasMore: false when results <= pageSize', async () => {
        const mockData = { posts: [{ title: 'Test 1' }], hasMore: false };
        mockPostRepository.searchPublished.mockResolvedValue(mockData);

        const result = await PostService.search(mockArgs);
        expect(result).toEqual(mockData);
    });

    it('should return hasMore: true when repository indicates more results', async () => {
        const mockData = {
            posts: Array(5).fill({ title: 'Test' }),
            hasMore: true
        };
        mockPostRepository.searchPublished.mockResolvedValue(mockData);

        const result = await PostService.search(mockArgs);
        expect(result.hasMore).toBe(true);
        expect(result.posts).toHaveLength(5);
    });

    it('should pass the correct arguments to the repository', async () => {
        mockPostRepository.searchPublished.mockResolvedValue({ posts: [], hasMore: false });

        await PostService.search({ query: 'hello', page: 2, pageSize: 10 });

        expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({
            query: 'hello',
            page: 2,
            pageSize: 10
        });
    });
});

