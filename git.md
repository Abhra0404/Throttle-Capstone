git reset --soft HEAD~1
git push --force-with-lease origin main

git add .
git -c user.name="Account One" \
    -c user.email="account1@example.com" \
    commit -m "Add authentication"
git push origin main