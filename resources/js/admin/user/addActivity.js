/*jshint esversion: 6 */
export function addActivity(vm, desc) {

  return new Promise((res, rej) => {
    vm.userActivity.user_id = vm.currentUser.id;
    vm.userActivity.user_name = vm.currentUser.name;
    vm.userActivity.desc = desc;
  
    axios.post('/api/user/activity', vm.userActivity)
    .then(response => {
      return res(true);
    })
    .catch(err => {
      return rej(err);
    });
  })
}