import React from "react"
import PropTypes from "prop-types"

import cutOutStyles from "./cut-out.module.scss"

const CutOut = ({ children }) => {
    return <div className={cutOutStyles.cutOut}>{children}</div>
}

CutOut.propTypes = {
    children: PropTypes.node.isRequired,
}

export default CutOut
