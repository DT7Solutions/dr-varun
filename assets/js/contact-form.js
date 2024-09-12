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

    function submitForm(formId) {
        const form = document.getElementById(formId);
        const dateInput = form.querySelector('#date');
        const timeSlotSelect = form.querySelector('#timeSlot');
        const formMessage = form.querySelector('#formMessage');
        const successMessage = form.querySelector('#successMessage');
        const errorMessage = form.querySelector('#errorMessage');
        const input = form.querySelector("#phone");
        const iti = window.intlTelInput(input, {
            initialCountry: "in",
            separateDialCode: true,
            preferredCountries: ["in", "gb"],
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
        });

        function resetForm() {
            form.reset();
            formMessage.classList.add('d-none');
            form.classList.remove('d-none');
        }

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

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = form.querySelector('#name').value;
            const email = form.querySelector('#email').value;
            const phone = form.querySelector('#phone').value;
            const service = form.querySelector('#service').value;
            const date = form.querySelector('#date').value;
            const timeSlot = form.querySelector('#timeSlot').value;

            // Validate form
            if (!name || !email || !phone || !service || !date || !timeSlot) {
                alert("Please fill all fields.");
                return;
            }

            // Prepare data
            const formData = {
                name: name,
                email: email,
                phone: iti.getNumber(),
                service: service,
                date: date,
                timeSlot: timeSlot,
            };

            // Create promises for sending data
            const emailPromise = emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData);
            const sheetsPromise = fetch('https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Sheet1!A1:append?valueInputOption=RAW&key=YOUR_API_KEY', {
                method: 'POST',
                body: JSON.stringify({
                    values: [[name, email, phone, service, date, timeSlot]]
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            Promise.allSettled([emailPromise, sheetsPromise])
                .then(results => {
                    let emailSuccess = results[0].status === 'fulfilled';
                    let sheetsSuccess = results[1].status === 'fulfilled';
                    
                    if (emailSuccess || sheetsSuccess) {
                        successMessage.classList.remove('d-none');
                        errorMessage.classList.add('d-none');
                    } else {
                        successMessage.classList.add('d-none');
                        errorMessage.classList.remove('d-none');
                    }
                    
                    // Log for debugging
                    console.log("EmailJS result:", results[0]);
                    console.log("Google Sheets result:", results[1]);
                })
                .catch(error => {
                    // Handle unexpected errors
                    console.error("Unexpected error:", error);
                    successMessage.classList.add('d-none');
                    errorMessage.classList.remove('d-none');
                })
                .finally(() => {
                    // Reset form and hide after a delay
                    setTimeout(() => {
                        $('#' + formId).modal('hide'); // For modals
                        resetForm();
                    }, 3000);
                });

            console.log("Form submitted successfully!", JSON.stringify(formData, null, 2));
        });
    }

    // Initialize the form handling for both modal and normal forms
    submitForm('appointmentForm'); // For normal form
    submitForm('appointmentModalForm'); // For modal form
});
