export function findGeneratingPaths(mod: number) {
    let paths = []
    for (var base = 0; base < mod; base++) {
        paths.push(exponentiate(base, mod))
    }
    console.log(paths)
    return paths
}

export function exponentiate(base: number, mod: number):Array<number> {
    let v = base
    let generated = new Map()
    let list = []
    while (!generated.has(v)) {
        generated.set(v, true)
        list.push(v)
        v = v * base % mod
    }
    return list
}