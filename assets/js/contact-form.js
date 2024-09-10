jQuery(document).ready(function () {
	jQuery('#submit').on('click',document,function(){
			if(jQuery('#captcha_val').val()!=jQuery('#captcha_text').val()){
				$('#captcha_text').parent('div').append('<span class="error">Captch is not match</span>');
			}
			else{
				jQuery("#contactpage").validate({
					submitHandler : function (e) {
						submitSignupFormNow(jQuery("#contactpage"))
					},
					rules : {
						fname : {
							required : true
						},
						email : {
							required : true,
							email : true
						}
					},
					errorElement : "span",
					errorPlacement : function (e, t) {
						e.appendTo(t.parent())
					}
				});
				submitSignupFormNow = function (e) {
					var t = e.serialize();
					var n = "contact-form.php";
					jQuery.ajax({
						url : n,
						type : "POST",
						data : t,
						success : function (e) {
							var t = jQuery.parseJSON(e);
							if (t.status == "Success") {
								jQuery("#form_result").html('<span class="form-success alert alert-success d-block">' + t.msg + "</span>");
							} else {
								jQuery("#form_result").html('<span class="form-error alert alert-danger d-block">' + t.msg + "</span>")
							}
							jQuery("#form_result").show();
						}
					});
					return false
				}
		}
	});
	
})



// Appointments Form
const dateInput = document.getElementById('date');
const timeSlotInput = document.getElementById('time-slot');
const formMessage = document.getElementById('form-message');
const successSvg = document.getElementById('success-svg');
const errorSvg = document.getElementById('error-svg');
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const minDate = `${yyyy}-${mm}-${dd}`;
dateInput.setAttribute('min', minDate);

let bookedSlots = ['10:00 AM - 10:15 AM', '12:00 PM - 12:15 PM']; 

function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
}

function generateTimeSlots(selectedDate) {
    timeSlotInput.innerHTML = ''; 
    let startTime = new Date(selectedDate);
    startTime.setHours(9, 0, 0, 0);

    const currentTime = new Date();
    const isToday = selectedDate.toDateString() === currentTime.toDateString();

    for (let i = 0; i < 36; i++) {
        let endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 15);

        const startTimeString = formatTime(startTime);
        const endTimeString = formatTime(endTime);
        const timeSlotString = `${startTimeString} - ${endTimeString}`;

        const option = document.createElement('option');
        option.value = timeSlotString;
        option.textContent = timeSlotString;

        if (bookedSlots.includes(timeSlotString)) {
            option.disabled = true;
            option.classList.add('slot-booked');
            option.textContent += ' (Booked)';
        } else if (isToday && startTime < currentTime) {
            option.disabled = true;
            option.classList.add('slot-past');
            option.textContent += ' (Past)';
        }

        timeSlotInput.appendChild(option);
        startTime = endTime;
    }
}

dateInput.addEventListener('change', function () {
    const selectedDate = new Date(this.value);
    if (!isNaN(selectedDate.getTime()) && selectedDate >= today) { 
        generateTimeSlots(selectedDate);
    } else {
        timeSlotInput.innerHTML = '<option value="">Choose Time Slot</option>';
    }
});

document.getElementById('contactpage').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = {
        fname: document.getElementById('fname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        department: document.getElementById('department').value,
        date: document.getElementById('date').value,
        timeSlot: document.getElementById('time-slot').value
    };

    if (formData.fname && formData.email && formData.phone && formData.department && formData.date && formData.timeSlot) {
        console.log('Your Form Submited Successfully:', JSON.stringify(formData, null, 2));

        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
            .then((response) => {
                console.log('Success:', response);
                showSuccessMessage();
            })
            .catch((error) => {
                console.log('Error:', error);
                showErrorMessage();
            });
    } else {
        showErrorMessage();
    }
});

function showSuccessMessage() {
    formMessage.classList.remove('hidden');
    successSvg.classList.remove('hidden');
    document.querySelector('.form-box').classList.add('hidden');
}

function showErrorMessage() {
    formMessage.classList.remove('hidden');
    errorSvg.classList.remove('hidden');
}
