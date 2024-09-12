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
                appointmentForm.classList.remove('d-none');
            }, 3000);

            console.log(JSON.stringify(formData));

        }, 1000);
    });
    populateTimeSlots(dateInput.value);
});
