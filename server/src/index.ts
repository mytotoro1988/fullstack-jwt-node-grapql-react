import { createConnection } from "typeorm";
import { User } from "./entities/User"; // Example entity
import express from "express";
import { createServer } from "http";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { GreetingResolver } from "./resollvers/greeting";

const main = async () => {
  await createConnection({
    type: "postgres", // or "postgres", "sqlite", etc.
    username: "cuong3",
    password: "1234",
    database: "jwt-authen-tut",
    logging: true,
    synchronize: true,
    entities: [
      User, // Add your entities here
    ],
  });

  const app = express();

  const httpServer = createServer(app);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      validate: false,
      resolvers: [GreetingResolver],
    }),
    plugins: [
      ApolloServerPluginDrainHttpServer({
        httpServer,
      }),
      ApolloServerPluginLandingPageGraphQLPlayground,
    ],
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  const PORT = process.env.POST || 4000;

  await new Promise((resolve) => {
    return httpServer.listen({ port: PORT }, resolve as () => void);
  });

  console.log(
    `Server stated on port ${process.env.PORT}! GRAPHQL ENDPOINT ON http://localhost:${PORT}${apolloServer.graphqlPath} `
  );
};

main().catch((error) => {
  console.log(error);
});
