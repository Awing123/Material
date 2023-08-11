export function generateLabelAndText(label, text, colspan = 1) {
  return [
    { type: 'label', value: label },
    { type: 'text', value: text, colspan }
  ]
}

export function generateLabelAndTextByList(list = []) {
  return list.reduce((result, item) => {
    return result.concat(generateLabelAndText(item.label, item.text, item.colspan))
  }, [])
}