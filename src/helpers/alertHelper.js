import Swal from "sweetalert2";
//icon: success,error,warning

export function basicAlertSwal(titleValue, iconValue, timerValue) {
  Swal.fire({
    position: "top-end",
    icon: iconValue == undefined ? "success" : iconValue,
    title: titleValue,
    showConfirmButton: false,
    timer: timerValue == undefined ? 1500 : timerValue,
  });
}
