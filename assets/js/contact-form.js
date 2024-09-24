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

    // Set minimum selectable date to today
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    dateInput.setAttribute("min", formattedToday);

    // Populate time slots based on the selected date
    function populateTimeSlots(selectedDate) {
        timeSlotSelect.innerHTML = '<option value="" disabled selected>Select a time slot</option>';
        const startHour = 9; // 9 AM
        const endHour = 18; // 6 PM (inclusive)
        const timeSlotDuration = 15; // 15 minutes

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

                // Check if the slot is in the past
                if (isToday && slotStartTime < currentDate) {
                    // Faded out past time slots
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
            dateInput.value = ""; // Reset date input
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

        // Send appointment data to EmailJS
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", appointmentData)
            .then(function (response) {
                document.getElementById("successMessage").classList.remove("d-none");
                console.log("Success!", response.status, response.text);
            }, function (error) {
                document.getElementById("errorMessage").classList.remove("d-none");
                console.log("Failed...", error);
            });
    });
});

