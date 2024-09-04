"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const apollo_server_core_1 = require("apollo-server-core");
const greeting_1 = require("./resollvers/greeting");
const main = async () => {
    await (0, typeorm_1.createConnection)({
        type: "postgres",
        username: "cuong3",
        password: "1234",
        database: "jwt-authen-tut",
        logging: true,
        synchronize: true,
        entities: [
            User_1.User,
        ],
    });
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            validate: false,
            resolvers: [greeting_1.GreetingResolver],
        }),
        plugins: [
            (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({
                httpServer,
            }),
            apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground,
        ],
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    const PORT = process.env.POST || 4000;
    await new Promise((resolve) => {
        return httpServer.listen({ port: PORT }, resolve);
    });
    console.log(`Server stated on port ${process.env.PORT}! GRAPHQL ENDPOINT ON http://localhost:${PORT}${apolloServer.graphqlPath} `);
};
main().catch((error) => {
    console.log(error);
});
//# sourceMappingURL=index.js.map