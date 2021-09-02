/* @flow */

import { parse } from 'compiler/parser/index'
import { generate } from './codegen'
import { optimize } from './optimizer'
import { createCompilerCreator } from 'compiler/create-compiler'

export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  /*将AST进行优化
  */
  const ast = parse(template.trim(), options)  //parse用正则等方式解析template模板中的指令、class、style等数据，形成AST
  optimize(ast, options) //optimize的主要作用是标记static静态节点，当update更新界面时，会有一个patch的过程，diff算法会直接跳过静态节点，从而减少了比较的过程，优化了patch的性能
  const code = generate(ast, options) //generate是将AST转化成render funtion字符串的过程，结果是render的字符串及staticRendeFns字符串
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
