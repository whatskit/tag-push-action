import * as main from '../src/main'

describe('getDestinationTags', () => {
  it('single image', async () => {
    await setInput('dst', 'whatskit/linux-utils:ci')
    const res = await main.getDestinationTags()
    expect(res).toEqual(['whatskit/linux-utils:ci'])
  })

  it('multiple images', async () => {
    await setInput(
      'dst',
      'whatskit/linux-utils:ci\nquay.io/whatskit/linux-utils:ci'
    )
    const res = await main.getDestinationTags()
    expect(res).toEqual([
      'whatskit/linux-utils:ci',
      'quay.io/whatskit/linux-utils:ci'
    ])
  })

  it('multiline images', async () => {
    await setInput(
      'dst',
      `whatskit/linux-utils:ci
       quay.io/whatskit/linux-utils:ci`
    )
    const res = await main.getDestinationTags()
    expect(res).toEqual([
      'whatskit/linux-utils:ci',
      'quay.io/whatskit/linux-utils:ci'
    ])
  })
})

function setInput(name: string, value: string): void {
  process.env[getInputName(name)] = value
}

// See: https://github.com/actions/toolkit/blob/master/packages/core/src/core.ts#L67
function getInputName(name: string): string {
  return `INPUT_${name.replace(/ /g, '_').toUpperCase()}`
}
