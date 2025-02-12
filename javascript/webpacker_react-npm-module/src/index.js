import React from 'react'
import { createRoot } from 'react-dom/client'
import intersection from 'lodash/intersection'
import keys from 'lodash/keys'
import assign from 'lodash/assign'
import omit from 'lodash/omit'
import ujs from './ujs'

const CLASS_ATTRIBUTE_NAME = 'data-react-class'
const PROPS_ATTRIBUTE_NAME = 'data-react-props'

const WebpackerReact = {
  registeredComponents: {},
  renderedRoots: [],

  render(node, component) {
    const propsJson = node.getAttribute(PROPS_ATTRIBUTE_NAME)
    const props = propsJson && JSON.parse(propsJson)

    const reactElement = React.createElement(component, props)
    const root = createRoot(node)

    root.render(reactElement)
    this.renderedRoots.push(root);
  },

  registerComponents(components) {
    const collisions = intersection(keys(this.registeredComponents), keys(components))
    if (collisions.length > 0) {
      console.error(`webpacker-react: can not register components. Following components are already registered: ${collisions}`)
    }

    assign(this.registeredComponents, omit(components, collisions))
    return true
  },

  unmountComponents() {
    for (let i = 0; i < this.renderedRoots.length; i++) {
      this.renderedRoots[i].unmount();
    }
    this.renderedRoots = [];
  },

  mountComponents() {
    const { registeredComponents } = this
    const toMount = document.querySelectorAll(`[${CLASS_ATTRIBUTE_NAME}]`)

    for (let i = 0; i < toMount.length; i += 1) {
      const node = toMount[i]
      const className = node.getAttribute(CLASS_ATTRIBUTE_NAME)
      const component = registeredComponents[className]

      if (component) {
        if (node.innerHTML.length === 0) this.render(node, component)
      } else {
        console.error(`webpacker-react: can not render a component that has not been registered: ${className}`)
      }
    }
  },

  setup(components = {}) {
    if (typeof window.WebpackerReact === 'undefined') {
      window.WebpackerReact = this
      ujs.setup(this.mountComponents.bind(this), this.unmountComponents.bind(this))
    }

    window.WebpackerReact.registerComponents(components)
    window.WebpackerReact.mountComponents()
  }
}

export default WebpackerReact
