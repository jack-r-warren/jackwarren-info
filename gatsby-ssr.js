const React = require("react")

exports.onRenderBody = ({ setHeadComponents }) => {
    setHeadComponents([
        <script
            dangerouslySetInnerHTML={{
                __html: `
                    if (localStorage.getItem('currentTheme')) {
                      document.documentElement.setAttribute('data-theme', localStorage.getItem('currentTheme'))
                    }
                    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      document.documentElement.setAttribute('data-theme', 'dark')
                    }
                `,
            }}
        />,
    ])
}
