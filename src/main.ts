import expressServerFactory from "./factories/expressServerFactory";
import { DependencyContainer } from "./utils/dependency";

(async function main() {
    const server = await expressServerFactory(DependencyContainer.getInstance().cradle);
    
    await server.listen();
})().catch(console.error);
