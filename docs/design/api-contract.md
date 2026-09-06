# Inkwell API Contract — v1

## POST /api/auth/register
Request: { email: string, displayName: string, password: string }
Success: 201 { user: UserPublic, accessToken: string, refreshToken: string }
Errors:
    400 EMAIL_ALREADY_REGISTERED — "This email is already registered."
    400 WEAK_PASSWORD — "Password does not meet strength requirements."

## POST /api/auth/login
Request: { email: string, password: string }
Success: 200 { user: UserPublic, accessToken: string, refreshToken: string }
Errors:
    401 INVALID_CREDENTIALS — "Invalid email or password."

## GET /api/posts?page=n
Success: 200 { posts: PostPublic[], page: number, hasMore: boolean }

## POST /api/posts/:id/comments
Request: { body: string, accessToken: string }
Success: 201 { id: string, postId: string, authorId: string, body: string, createdAt: DateTime }
Errors:
    400 INVALID_COMMENT_BODY — "Comment body must be non-empty"
    401 UNAUTHENTICATED_REQUEST — "Authentication is required to post a comment"
    404 POST_NOT_FOUND — "Requested post not found"