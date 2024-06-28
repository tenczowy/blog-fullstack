export function validateLogin(login, password, users) {
  if (!users) return;

  //   console.log(login, password, users);

  if (
    users.find((user) => user.login === login) &&
    users.find((user) => user.password === password)
  ) {
    return users.find((user) => user.login === login);
  } else {
    return false;
  }
}
