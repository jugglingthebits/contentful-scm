import * as yargs from 'yargs';

export async function main() {
    const env = yargs.env();
    env.version(false)
        .demandCommand()
        .parse();
}
