import { EventBus } from "../event-bus.js";

export let postCount = 0;

EventBus.on("post.published", (payload) => {
    postCount += 1;
});