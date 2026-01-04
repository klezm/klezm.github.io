find /home/codespace -name "*type-unification*" -o -name "History" -type d 2>/dev/null | head -20
ls -la /home/codespace/.vscode-remote/data/User/History/ | head -20
find /home/codespace/.vscode-remote/data/User/History -name "*type-unification*" 2>/dev/null
find /home/codespace/.vscode-remote/data/User/History -type f 2>/dev/null | xargs grep -l "type-unification" 2>/dev/null | head -10
find /home/codespace/.vscode-remote/data/User/History -type f 2>/dev/null | xargs grep -l "type-unification" 2>/dev/null
cd /workspaces/klezm.github.io && npm run dev
cd /workspaces/klezm.github.io && npm run build
grep -E "sun|moon" node_modules/@astrojs/starlight/components/Icons.ts || grep -E "sun|moon" node_modules/@astrojs/starlight/components/Icons.js
grep -E "themeSelect" node_modules/@astrojs/starlight/translations/en.json
find node_modules/@astrojs/starlight -name "constants.d.ts"
ls node_modules/@astrojs/starlight/constants.*
npx tsx test-import.ts
rm /workspaces/klezm.github.io/test-import.ts
grep "PAGE_TITLE_ID =" node_modules/@astrojs/starlight/constants.mjs || grep "PAGE_TITLE_ID =" node_modules/@astrojs/starlight/constants.js || echo "Not found"
find node_modules/@astrojs/starlight -name "constants.*" -exec grep -H "PAGE_TITLE_ID" {} +
mv /workspaces/klezm.github.io/src/components/ContentPanelOverride.astro /workspaces/klezm.github.io/src/components/ContentPanel.astro
mkdir -p /workspaces/klezm.github.io/src/components/override && mv /workspaces/klezm.github.io/src/components/ThemeSelect.astro /workspaces/klezm.github.io/src/components/PageTitle.astro /workspaces/klezm.github.io/src/components/ContentPanel.astro /workspaces/klezm.github.io/src/components/Hero.astro /workspaces/klezm.github.io/src/components/override/
ls -la /workspaces/klezm.github.io/src/assets/
cat /workspaces/klezm.github.io/node_modules/starlight-blog/schema.d.ts 2>/dev/null || cat /workspaces/klezm.github.io/node_modules/starlight-blog/schema.js 2>/dev/null || find /workspaces/klezm.github.io/node_modules/starlight-blog -name "*.ts" -o -name "*.d.ts" 2>/dev/null | head -20
cat /workspaces/klezm.github.io/node_modules/starlight-blog/schema.js
grep -r "cover" /workspaces/klezm.github.io/node_modules/starlight-blog/ --include="*.ts" --include="*.js" 2>/dev/null | head -30
cat /workspaces/klezm.github.io/node_modules/starlight-blog/schema.ts
realpath --relative-to=/workspaces/klezm.github.io/src/content/docs/blog /workspaces/klezm.github.io/src/assets/type-inference-unification.jpg
file /workspaces/klezm.github.io/src/assets/type-inference-unification.jpg && head -c 20 /workspaces/klezm.github.io/src/assets/type-inference-unification.jpg | xxd
cd /workspaces/klezm.github.io && npm run build 2>&1 | head -100
cd /workspaces/klezm.github.io && npm run build 2>&1 | tail -50
cd /workspaces/klezm.github.io && npm run dev 2>&1 &
npm run dev -- --port 4321 &
