# 2023-1-4

- [x] 当光标点击激活一个节点, 此时点击另一个可激活节点, 无法正常切换激活, 只在点击时出现这个 bug, 猜测是因为 focusOn 传入的 isCrossLine
- [x] 光标点击无法正确的获得 syntax 的位置, 表现为, 点击一个已触发节点, 光标总会往右有个偏移, 猜测和激活逻辑有关
- [x] 当光标点击行尾, 且行尾是一个 syntax, 无法正确的在激活后将光标移动到 suffix 之后, 这个和上一个应该是同一个问题
- [x] 草, 之前有个 bug 忘了被我记到哪里去了(补: 原来就是这个点击行尾空白 panic 的 bug)
- [x] md, 刚合分支就发现现在 update 的逻辑有问题, 光标乱飞
- [x] 在一行输入 marker 触发 syntax, 在取消激活后, 光标的输入仍会有一个偏移

# 2023-1-5

- [x] 点击激活行尾的 syntax, 再点击行尾空白处, 会出现 out of bound 的 panic 信息, 和昨天的第二个应该是同一个问题

# 2023-1-6

- [x] 通过删除的方式命中 syntax 的尾部从而激活节点, 光标无法正确的向右位移
- [x] 删除 syntax 的 suffix 的最后一个字符时, 光标乱飞, 这个应该是无法正确获取 ancestorIdx 激活错误导致的
- [x] 在 syntax 的尾部输入空格时, 光标乱飞
- [x] 在行尾 syntax 的 suffix 处删除时, 报错 out of bound
- [x] 先输入 suffix, 再输入 prefix 时, 光标会往右有个多余的偏移
- [x] 当 line 只有一个 syntax 时, 通过方向键移入 syntax 头部无法正确激活, 且此时右移一位就可激活, 再次左移取消激活, 不对草, 这个 bug 是因为头部存在一个空格, 且空格没有正确的渲染出来
- [ ] 头部空格无法正确渲染
- [ ] parser 错误, `a**b* **c**` 被解析成 `a` `**b* **` `c**` 三个节点

# 2023-1-7

- [ ] 当 block 下面接着一个 line, 在 line 头部做跨行删除, 会导致无法正确的获取新的 textContent, 是因为暂时还没做 block, 不知道如何得到 block 的最后一个 line 的内容
- [ ] 现在的 newLine 应该根据当前所处的 block/line 的类型, 实例化出自身的类型, 以此来优化用户体验
- [ ] 在 syntax 中 newLine, 再跨行删除, 期望其恢复原样, 但是会 panic 说 out of bound, 具体的, 应该是因为删除导致当前行形成可被激活的 syntax, 因此 out of bound
- [ ] 在行尾 newLine 会 panic 说拿不到 fenceInfo, 是需要做默认的 empty line
- [ ] jest 测试时, 报错 LinkedList 不是一个 constructor
- [ ] 跨行删除无法处理空行的情况
