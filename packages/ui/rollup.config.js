import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';

const inputSrc = [
  ['./src/index.tsx', 'es'],
  ['./src/index.tsx', 'cjs'],
];

const extensions = ['.ts', '.tsx'];

// eslint-disable-next-line import/no-anonymous-default-export
export default inputSrc.map(([input, format]) => ({
  input,
  external: ['lodash', 'react-table'],
  output: [
    {
      dir: `dist/${format}`,
      format,
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ extensions, preferBuiltins: true }),
    commonjs(),
    babel({
      extensions,
      include: ['src/**/*'],
      exclude: 'node_modules/**',
    }),
  ],
}));
