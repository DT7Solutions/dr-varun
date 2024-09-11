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


document.addEventListener('DOMContentLoaded', function () {
    emailjs.init("YOUR_USER_ID"); // Replace with your EmailJS user ID

    var input = document.querySelector("#phone");
    var iti = window.intlTelInput(input, {
        initialCountry: "in",
        separateDialCode: true,
        preferredCountries: ["in", "gb"],
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
    });
    
    const appointmentForm = document.getElementById('appointmentForm');
    const dateInput = document.getElementById('date');
    const timeSlotSelect = document.getElementById('timeSlot');
    const formMessage = document.getElementById('formMessage');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Define working hours and time slots
    const startHour = 9;
    const endHour = 18;
    const timeSlotDuration = 15; // minutes
    const timeSlots = [];
    const now = new Date();

    function generateTimeSlots() {
        let startTime = new Date();
        startTime.setHours(startHour, 0, 0, 0); // Start at 9:00 AM

        while (startTime.getHours() < endHour) {
            let endTime = new Date(startTime);
            endTime.setMinutes(startTime.getMinutes() + timeSlotDuration);
            timeSlots.push({ start: new Date(startTime), end: endTime, display: `${formatTime(startTime)} - ${formatTime(endTime)}` });
            startTime.setMinutes(startTime.getMinutes() + timeSlotDuration);
        }
    }

    function formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${period}`;
    }

    function populateTimeSlots(date) {
        timeSlotSelect.innerHTML = '<option value="">Select a time slot</option>';
        const selectedDate = new Date(date);

        timeSlots.forEach(slot => {
            const slotDate = new Date(selectedDate);
            slotDate.setHours(slot.start.getHours(), slot.start.getMinutes());

            const option = document.createElement('option');
            option.value = slot.display;

            if (slotDate < now || (slotDate.getDate() < now.getDate() && slotDate.getMonth() <= now.getMonth() && slotDate.getFullYear() <= now.getFullYear())) {
                option.classList.add('disabled');
                option.disabled = true;
                option.textContent = slot.display;
                option.style.backgroundColor = 'lightcoral';
            } else {
                option.classList.add('available');
                option.textContent = slot.display;
            }

            timeSlotSelect.appendChild(option);
        });
    }

    function disablePastDates() {
        let today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    function handleDateChange() {
        populateTimeSlots(dateInput.value);
    }

    dateInput.addEventListener('change', handleDateChange);
    disablePastDates();
    generateTimeSlots();

    appointmentForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;
        const timeSlot = document.getElementById('timeSlot').value;

        // Validate form
        if (!name || !email || !phone || !service || !date || !timeSlot) {
            alert("Please fill all fields.");
            return;
        }

        // Prepare data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: iti.getNumber(),
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            timeSlot: document.getElementById('timeSlot').value,
        };

        // Simulate form submission
        setTimeout(() => {
            debugger
            const isSuccess = Math.random() > 0.5;
            formMessage.classList.remove('d-none');
            if (isSuccess) {
                appointmentForm.classList.add('d-none');
                successMessage.classList.remove('d-none');
                errorMessage.classList.add('d-none');
            } else {
                appointmentForm.classList.add('d-none');
                successMessage.classList.add('d-none');
                errorMessage.classList.remove('d-none');
            }

            // Send data to EmailJS
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
                .then(() => {
                    console.log("Email sent successfully.");
                    iti.setNumber(""); 
                }, (error) => {
                    console.log("Failed to send email:", error);
                });

            // Send data to Google Sheets
            fetch('https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Sheet1!A1:append?valueInputOption=RAW&key=YOUR_API_KEY', {
                method: 'POST',
                body: JSON.stringify({
                    values: [[name, email, phone, service, date, timeSlot]]
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
              .then(data => console.log("Data sent to Google Sheets:", data))
              .catch(error => console.log("Failed to send data to Google Sheets:", error));

            setTimeout(() => {
                $('#appointmentModal').modal('hide');
                appointmentForm.reset();
                formMessage.classList.add('d-none');
            }, 3000);

            console.log(JSON.stringify(formData));

        }, 1000);
    });
    populateTimeSlots(dateInput.value);
});
