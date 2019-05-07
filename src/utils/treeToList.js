
const tree = [
  {
    id: '1',
    pid: '0',
    children: [
      {
        id: '2',
        pid: '1',
        children: []
      }
    ]
  }
]
const list = [{
  id: '1',
  pid: '0'

},
{
  id: '2',
  pid: '1'

}
]
export function treeToList(tree, list) {
  for (item in tree) {
    list.push(item)
    if (item.children) {
      this.treeToList(children, list)
    }
  }
}

