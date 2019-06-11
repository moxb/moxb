const mobxReact = require('mobx-react');
const mobx = require('mobx');

// for tests, do not inject any values when observing.
mobxReact.observer = function(component) {
    if (component.prototype && typeof component.prototype.render === 'function') {
        if (!component.prototype._render) {
            component.prototype._componentDidMount = component.prototype.componentDidMount;
            component.prototype.componentDidMount = function() {
                this.___reaction_disposer___ = mobx.autorun(() => {
                    const operation = this.props && this.props.operation;
                    if (operation) {
                        if (operation.value || operation.values || operation.error || operation.errors) {
                            this.setState({});
                        }
                    }
                });

                if (component.prototype._componentDidMount) {
                    component.prototype._componentDidMount();
                }
            };

            component.prototype._componentWillUnmount = component.prototype.componentWillUnmount;
            component.prototype.componentWillUnmount = function() {
                if (this.___reaction_disposer___) {
                    this.___reaction_disposer___();
                }

                if (component.prototype._componentWillUnmount) {
                    component.prototype._componentWillUnmount();
                }
            };
        }
    }

    return component;
};

module.exports = mobxReact;
