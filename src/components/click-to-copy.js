import PropTypes from "prop-types"
import React from "react"

import copy from "clipboard-copy"

import clickToCopyStyles from "./click-to-copy.module.scss"

class ClickToCopy extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            postText: "",
        }
    }

    render() {
        return (
            <>
                <button
                    className={clickToCopyStyles.copyButton}
                    onClick={() => {
                        copy(this.props.copy).then(
                            () =>
                                this.setState({
                                    postText: " - success!",
                                }),
                            () =>
                                this.setState({
                                    postText:
                                        " - failed, your browser doesn't support that",
                                })
                        )
                    }}
                >
                    {this.props.children}
                </button>
                {this.state.postText}
            </>
        )
    }
}

// Prop names must be lowercase if we're going to use this from markdown
// See https://using-remark.gatsbyjs.org/custom-components/#attribute-names-are-always-lowercased
ClickToCopy.propTypes = {
    copy: PropTypes.string.isRequired,
    children: PropTypes.node,
}

ClickToCopy.defaultProps = {
    children: "click to copy",
}

export default ClickToCopy
