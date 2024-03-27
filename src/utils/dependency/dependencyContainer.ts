import path from "path";
import { AwilixContainer, createContainer, Lifetime, asClass, asFunction } from "awilix";

export class DependencyContainer {
    private static instance: AwilixContainer;
    private static rootPath = path.resolve(path.join(__dirname, "..", ".."));

    public static getInstance(): AwilixContainer {
        if (typeof DependencyContainer.instance !== "undefined") {
            return DependencyContainer.instance;
        }

        DependencyContainer.instance = createContainer();
        DependencyContainer.instance.loadModules(
            [
                "controllers/**/*.ts",
                "controllers/**/*.js",
                "services/**/*.ts",
                "services/**/*.js",
                "repositories/**/*.ts",
                "repositories/**/*.js",
            ],
            {
                cwd: DependencyContainer.rootPath,
                formatName: "camelCase",
                resolverOptions: {
                    lifetime: Lifetime.SINGLETON,
                    register: asClass,
                },
            },
        );
        DependencyContainer.instance.loadModules(["routes/**/*.ts", "routes/**/*.js"], {
            cwd: DependencyContainer.rootPath,
            formatName: (name) => `${name.toLowerCase()}Router`,
            resolverOptions: {
                lifetime: Lifetime.SINGLETON,
                register: asFunction,
            },
        });
        DependencyContainer.instance.loadModules(["utils/helpers/**/*.ts", "utils/helpers/**/*.js"], {
            cwd: DependencyContainer.rootPath,
            formatName: (name) => `${name.toLowerCase()}`,
            resolverOptions: {
                lifetime: Lifetime.SINGLETON,
                register: asClass,
            },
        });

        return DependencyContainer.instance;
    }
}
