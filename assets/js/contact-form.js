// jQuery(document).ready(function () {
// 	jQuery('#submit').on('click',document,function(){
// 			if(jQuery('#captcha_val').val()!=jQuery('#captcha_text').val()){
// 				$('#captcha_text').parent('div').append('<span class="error">Captch is not match</span>');
// 			}
// 			else{
// 				jQuery("#contactpage").validate({
// 					submitHandler : function (e) {
// 						submitSignupFormNow(jQuery("#contactpage"))
// 					},
// 					rules : {
// 						fname : {
// 							required : true
// 						},
// 						email : {
// 							required : true,
// 							email : true
// 						}
// 					},
// 					errorElement : "span",
// 					errorPlacement : function (e, t) {
// 						e.appendTo(t.parent())
// 					}
// 				});
// 				submitSignupFormNow = function (e) {
// 					var t = e.serialize();
// 					var n = "contact-form.php";
// 					jQuery.ajax({
// 						url : n,
// 						type : "POST",
// 						data : t,
// 						success : function (e) {
// 							var t = jQuery.parseJSON(e);
// 							if (t.status == "Success") {
// 								jQuery("#form_result").html('<span class="form-success alert alert-success d-block">' + t.msg + "</span>");
// 							} else {
// 								jQuery("#form_result").html('<span class="form-error alert alert-danger d-block">' + t.msg + "</span>")
// 							}
// 							jQuery("#form_result").show();
// 						}
// 					});
// 					return false
// 				}
// 		}
// 	});
	
// })


// Contact Page Form

jQuery(document).ready(function () {
    jQuery('#contactpage').on('submit', function (e) {
        e.preventDefault(); 
        jQuery(".error-message").remove();

        var isValid = true;
        var contactform = {
            fname: document.getElementById("fname").value.trim(),
            lname: document.getElementById("lname").value.trim(),
            email: document.getElementById("contact-email").value.trim(),
            phone: document.getElementById("contact-phone").value.trim(),
            subject: document.getElementById("subject").value.trim(),
        };

        // Validate fields
        if (contactform.fname === '') {
            jQuery('#fname').after('<span class="error-message text-danger">First name is required.</span>');
            isValid = false;
        }
        if (contactform.lname === '') {
            jQuery('#lname').after('<span class="error-message text-danger">Last name is required.</span>');
            isValid = false;
        }
        if (contactform.email === '') {
            jQuery('#contact-email').after('<span class="error-message text-danger">Email is required.</span>');
            isValid = false;
        } else if (!validateEmail(contactform.email)) {
            jQuery('#contact-email').after('<span class="error-message text-danger">Please enter a valid email address.</span>');
            isValid = false;
        }
        if (contactform.phone === '') {
            jQuery('#contact-phone').after('<span class="error-message text-danger">Phone number is required.</span>');
            isValid = false;
        }
        if (contactform.subject === '') {
            jQuery('#subject').after('<span class="error-message text-danger">Subject Message is required.</span>');
            isValid = false;
        }
        if (!isValid) {
            return;
        }
        function validateEmail(email) {
            var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }

        // EmailJS configuration
        emailjs.init('YOUR_USER_ID');
        
        // Send the email using EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactform)
            .then(function (response) {
                jQuery("#form_result").html('<span class="form-success alert alert-success d-block">Your message has been sent successfully!</span>');
                console.log("Form submitted successfully!", JSON.stringify(contactform, null, 2), response.status, response.text);
                jQuery("#contactpage")[0].reset();
                setTimeout(function () {
                    jQuery("#form_result").fadeOut("slow", function () {
                        jQuery("#form_result").html('');
                    });
                }, 5000);
            }, function (error) {
                jQuery("#form_result").html('<span class="form-error alert alert-danger d-block">There was an error sending your message. Please try again later.</span>');
                console.log("Form submission failed! Try again.", JSON.stringify(contactform, null, 2), error);
                setTimeout(function () {
                    jQuery("#form_result").fadeOut("slow", function () {
                        jQuery("#form_result").html('');
                    });
                }, 5000);
            });
    });
});

/* ---------- Home page Appointment Form ----------- */ 
document.addEventListener("DOMContentLoaded", function () {
    const iti = window.intlTelInput(document.querySelector("#home-phone"), {
        initialCountry: "in",
        separateDialCode: true,
        preferredCountries: ["in", "gb"],
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
    });

    const dateInput = document.getElementById("home-date");
    const timeSlotSelect = document.getElementById("home-timeSlot");
    const appointmentForm = document.getElementById("appointmentForm");
    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");

    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    dateInput.setAttribute("min", formattedToday);

    function populateTimeSlots(selectedDate) {
        timeSlotSelect.innerHTML = '<option value="" disabled selected>Select a time slot</option>';
        const startHour = 9;
        const endHour = 18;
        const timeSlotDuration = 15;

        const currentDate = new Date();
        const isToday = selectedDate.toDateString() === currentDate.toDateString();

        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += timeSlotDuration) {
                const slotStartTime = new Date(selectedDate);
                slotStartTime.setHours(hour);
                slotStartTime.setMinutes(minute);

                const slotEndTime = new Date(slotStartTime);
                slotEndTime.setMinutes(slotEndTime.getMinutes() + timeSlotDuration);

                // Create time string in the desired format
                const formattedStart = slotStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                const formattedEnd = slotEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

                if (isToday && slotStartTime < currentDate) {
                    timeSlotSelect.innerHTML += `<option value="${formattedStart} - ${formattedEnd}" disabled style="color: lightgray;">${formattedStart} - ${formattedEnd}</option>`;
                } else {
                    timeSlotSelect.innerHTML += `<option value="${formattedStart} - ${formattedEnd}">${formattedStart} - ${formattedEnd}</option>`;
                }
            }
        }
    }

    // Check for valid future dates and populate time slots accordingly
    dateInput.addEventListener("change", function () {
        const selectedDate = new Date(dateInput.value);
        const currentDate = new Date();

        if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
            alert("Please select a valid future date.");
            dateInput.value = "";
            timeSlotSelect.innerHTML = '<option value="" disabled selected>Select a time slot</option>';
            return;
        }

        populateTimeSlots(selectedDate);
    });

    // Handle form submission
    appointmentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const appointmentData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: iti.getNumber(),
            service: document.getElementById("service").value,
            date: dateInput.value,
            timeSlot: timeSlotSelect.value
        };

        // Send appointment data to EmailJS
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", appointmentData)
            .then(function (response) {
                successMessage.classList.remove("d-none");
                console.log("Form submitted successfully!", JSON.stringify(appointmentData, null, 2), response.status, response.text);
                setTimeout(() => {
                    successMessage.classList.add("d-none");
                    appointmentForm.style.display = "block";
                    appointmentForm.reset(); 
                }, 3000);
            }, function (error) {
                errorMessage.classList.remove("d-none");
                console.log("Form submitted  Failed Try Again!", JSON.stringify(appointmentData, null, 2), error);
                setTimeout(() => {
                    errorMessage.classList.add("d-none");
                    appointmentForm.style.display = "block";
                    appointmentForm.reset();
                }, 3000);
            });
    });
});


/* ---------- All Pages Modal Popup Appointment Form ----------- */ 
document.addEventListener("DOMContentLoaded", function () {
    const iti = window.intlTelInput(document.querySelector("#phone"), {
        initialCountry: "in",
        separateDialCode: true,
        preferredCountries: ["in", "gb"],
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
    });

    const dateInput = document.getElementById("date");
    const timeSlotSelect = document.getElementById("timeSlot");
    const appointmentForm = document.getElementById("appointment-form");
    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");

    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    dateInput.setAttribute("min", formattedToday);

    function populateTimeSlots(selectedDate) {
        timeSlotSelect.innerHTML = '<option value="" disabled selected>Select a time slot</option>';
        const startHour = 9;
        const endHour = 18;
        const timeSlotDuration = 15;

        const currentDate = new Date();
        const isToday = selectedDate.toDateString() === currentDate.toDateString();
        
        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += timeSlotDuration) {
                const slotStartTime = new Date(selectedDate);
                slotStartTime.setHours(hour);
                slotStartTime.setMinutes(minute);

                const slotEndTime = new Date(slotStartTime);
                slotEndTime.setMinutes(slotEndTime.getMinutes() + timeSlotDuration);

                // Create time string in the desired format
                const formattedStart = slotStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                const formattedEnd = slotEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                if (isToday && slotStartTime < currentDate) {
                    timeSlotSelect.innerHTML += `<option value="${formattedStart} - ${formattedEnd}" disabled style="color: lightgray;">${formattedStart} - ${formattedEnd}</option>`;
                } else {
                    timeSlotSelect.innerHTML += `<option value="${formattedStart} - ${formattedEnd}">${formattedStart} - ${formattedEnd}</option>`;
                }
            }
        }
    }

    // Check for valid future dates and populate time slots accordingly
    dateInput.addEventListener("change", function () {
        const selectedDate = new Date(dateInput.value);
        const currentDate = new Date();

        if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
            alert("Please select a valid future date.");
            dateInput.value = "";
            timeSlotSelect.innerHTML = '<option value="" disabled selected>Select a time slot</option>';
            return;
        }

        // Populate time slots based on the selected date
        populateTimeSlots(selectedDate);
    });

    // Handle form submission
    appointmentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const appointmentData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: iti.getNumber(),
            service: document.getElementById("service").value,
            date: dateInput.value,
            timeSlot: timeSlotSelect.value
        };

        appointmentForm.style.display = "none";

        // Send appointment data to EmailJS
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", appointmentData)
            .then(function (response) {
                successMessage.classList.remove("d-none");
                console.log("Form submitted successfully!", JSON.stringify(appointmentData, null, 2), response.status, response.text);
                setTimeout(() => {
                    successMessage.classList.add("d-none");
                    appointmentForm.style.display = "block";
                    appointmentForm.reset(); 
                }, 3000);
            }, function (error) {
                errorMessage.classList.remove("d-none");
                console.log("Form submitted  Failed Try Again!", JSON.stringify(appointmentData, null, 2), error);
                setTimeout(() => {
                    errorMessage.classList.add("d-none");
                    appointmentForm.style.display = "block";
                    appointmentForm.reset();
                }, 3000);
            });
    });
});

