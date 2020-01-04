const React = require("react")

exports.onRenderBody = ({ setHeadComponents }) => {
    setHeadComponents([
        <script
            dangerouslySetInnerHTML={{
                __html: `
                    if (localStorage.getItem('theme')) {
                      document.documentElement.setAttribute('data-theme', localStorage.getItem('theme'))
                    }
                    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      document.documentElement.setAttribute('data-theme', 'dark')
                    }
                `,
            }}
        />,
    ])
}
