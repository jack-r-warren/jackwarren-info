---
title: Fixing FTK Imager Scaling
date: 2020-01-19
---

As of this writing, FTK Imager doesn't respect Windows text size / text scaling / high DPI settings.

You can fix this by having Windows 10 override the text sizing; instructions below.

<!-- endexcerpt -->

1. Right click on the `FTK Imager.exe` file in the application's folder
2. Select "Properties"
3. Go to the "Compatibility" tab
4. Click the "Change high DPI settings" button
5. Check the box for "Override high DPI scaling behavior"
6. Set the "Scaling performed by" dropdown menu to "System (Enhanced)"
