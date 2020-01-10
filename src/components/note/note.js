import React from "react"
import PropTypes from "prop-types"
import CutOut from "../layout/cut-out/cut-out"

const Note = ({ children }) => {
    return (
        <CutOut>
            <h3>Note</h3>
            {children}
        </CutOut>
    )
}

Note.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Note
