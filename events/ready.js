module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        client.user.setActivity("my life", {
            type: "STREAMING",
            url: "https://www.youtube.com/watch?v=e97w-GHsRMY"
        });
    },
};