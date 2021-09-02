/* @flow */

export default class VNode {
  tag: string | void; //当前节点的标签名
  data: VNodeData | void; //当前节点对应的对象，包含具体的数据信息，是一个VNodeData类型，可参考VNodeData类型中的数据信息
  children: ?Array<VNode>;//当前节点的子节点，是一个数组
  text: string | void;//当前节点的文本
  elm: Node | void;//当前虚拟节点对应的真实dom节点
  ns: string | void;//当前节点的名字空间
  context: Component | void; // rendered in this component's scope //编译作用域
  key: string | number | void;//节点的key属性，被当做节点的标志，用以优化，diff算法中有用到
  componentOptions: VNodeComponentOptions | void;//组件的options选项
  componentInstance: Component | void; // component instance //当前节点对应的组件的实例
  parent: VNode | void; // component placeholder node //当前节点的父节点

  // strictly internal
  raw: boolean; // contains raw HTML? (server only) //、、、是否为原生HTML或只是普通文本
  isStatic: boolean; // hoisted static node //静态节点标志
  isRootInsert: boolean; // necessary for enter transition check //是否为根结点插入
  isComment: boolean; // empty comment placeholder? //是否为注释节点
  isCloned: boolean; // is a cloned node? //是否为cloned
  isOnce: boolean; // is a v-once node? 
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
//创建空VNode节点
export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}
//创建一个文本节点
export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
export function cloneVNode (vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true
  return cloned
}
