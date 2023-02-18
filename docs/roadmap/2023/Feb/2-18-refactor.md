# 关于 snapshot 重构

前两天捣鼓的记录不小心搞丢了, 主要是重构日记丢了, 不过没什么大问题, 目前已经大致重构完成

简单记录一下这几天的一些思路和遇到的问题

## 关于 snapshot 结构

原本是

```typescript
interface Snapshot {
  block: Operable;
  vNode: VirtualNode;
  fence: Fence;

  offset: number;
  cursor: CursorInfo;
  fenceInfo: FenceInfo;
}
```

但是 fenceInfo 很不好处理, 因为 updateContent 时, 会得到一个部分激活的节点, 需要再次 focusOn 来激活剩余需要激活的部分

这里的问题就在于, uodateContent 中, 只能正确的得到一定要被激活的 ancestorIdx

因此如果要得到完整的 fenceInfo, 就意味着要从 acnestorIdx 得到 fenceInfo, 这很不好处理, 并且浪费性能

因此干脆就吧 fenceInfo 换成了 actived, 只保存当前已经被激活的 ancestorIdx

这样还有个好处就是 patch 中就可以得到 snapshot, 有助于后续优化代码结构

因此现在的结构就是

```typescript
interface Snapshot {
  block: Operable;
  vNode: VirtualNode;
  fence: Fence;

  offset: number;
  cursor: CursorInfo;
  actived: Array<number>;
}
```

## 关于状态机重构

整个架构从设计到实现就一直在追求状态驱动, 而这次重构原本是个机会重构为状态机, 也确实尝试了重构为严格的状态机

原本划分了一下状态

1. init
2. actived
3. deactived
4. destoryed

但是发现, snapshot 会被用到就意味着节点一定被激活, 或者说只有已经激活的 snapshot 才有着不可替代的作用

因此就简化为只有 deactived 和 actived, 接着就发现, 这样不如直接不实现为严格的状态机, 因为目前的设计其实就已经支持状态驱动

没必要为了一份醋包顿饺子

## 补档

目前重构已经完成, 但是还没有完全完成, 从一开始就期望的 snapshot 与实际状态同步的问题还没有解决

关于 actived 可以在深拷贝节点时, 保存已经被激活的节点得到 actived, 这里几乎不会有额外的性能损耗

主要问题在于如何得到 offset 和 cursor, 如果直接保存在 Operable 中可以实现, 但是有必要么

## 补档

现在这样好像也没什么问题, 暂时先这样, 去掉 snapshot 函数

那么目前为止重构算是完成了
