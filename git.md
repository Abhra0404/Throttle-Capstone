git reset --soft HEAD~1
git push --force-with-lease origin main

git add .
git -c user.name="Ahmad-Ibni-Shafi" \
    -c user.email="ibnishafiahmad@gmail.com" \
    commit -m "Add authentication"
git push origin main

git -c user.name="kishan0005" \
    -c user.email="kkishan22374@gmail.com" \
    commit -m "Made a frontend dashboard with components"