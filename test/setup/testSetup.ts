import { DependencyContainer, Types } from "../../src/utils/dependency";

afterAll(async () => {
    const dependencyContainer = DependencyContainer.getInstance();
    const db = dependencyContainer.resolve(Types.Database)
    await db.close();
})
