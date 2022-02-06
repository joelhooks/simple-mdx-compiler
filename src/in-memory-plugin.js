import path from 'path'
import {v4 as uuid} from 'uuid'

let absoluteFiles = {}
const cwd = path.join(process.cwd(), `__mdx_bundler_fake_dir__`)

export const inMemoryPlugin = {
    name: 'inMemory',
    setup(build) {
        build.onResolve({filter: /.*/}, ({path:filePath, importer}) => {

            let entryPath = path.join(cwd, `./_mdx_bundler_entry_point-${uuid()}.mdx`)
            absoluteFiles[entryPath] = importer

            const modulePath = path.resolve(path.dirname(importer), filePath)
            
            for (const ext of ['.js', '.ts', '.jsx', '.tsx', '.json', '.mdx']) {
            const fullModulePath = `${modulePath}${ext}`
            if (fullModulePath in absoluteFiles) {
                return {
                path: fullModulePath,
                pluginData: {
                    inMemory: true,
                    contents: absoluteFiles[fullModulePath],
                },
                }
            }
            }
        })

        build.onLoad({filter: /.*/}, ({path:filePath, pluginData}) => {
            const fileType = (path.extname(filePath) || '.jsx').slice(1)
            const contents = absoluteFiles[filePath]

            if (fileType === 'mdx') return null

            let loader

            if (
                build.initialOptions.loader &&
                build.initialOptions.loader[`.${fileType}`]
            ) {
                loader = build.initialOptions.loader[`.${fileType}`]    
            } else {
                loader = /** @type import('esbuild').Loader */ (fileType)          
            }

            return {
                contents,
                loader,
            }
        })
    }
}