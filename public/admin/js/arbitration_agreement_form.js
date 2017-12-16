//form wizard
$('#formWizard').bootstrapWizard({
    //'nextSelector': '.button-next',
    onShow: function () {
        $(".select2").select2();
    }
});

$(document).on('change', '.agreementType', function (event) {
    var thisObj = $(this);
    var htmlEle = '';
    console.log($(thisObj).val());
    if ($(thisObj).val() == 'single') {
        $('#myModal_confirm_popup_single_tier').modal({backdrop: 'static', keyboard: false})
    } else if ($(thisObj).val() == 'two') {
        $('#myModal_confirm_popup_two_tier').modal({backdrop: 'static', keyboard: false})
    }

    if ($('#agreementTypeDiv').html() == '') {
        loadAgreementTypeContent(thisObj);
    } else {

        if ($(thisObj).val() == 'single') {
            console.log($(thisObj).val());
            $('.twoTeirDiv').hide();
            $('#place_of_appeal').attr('disabled', true);
            $('#place_of_appeal_primary_id').attr('disabled', true);
            $('#myModal_confirm_popup_single_tier').modal({backdrop: 'static', keyboard: false})
        } else if ($(thisObj).val() == 'two') {
            $('#myModal_confirm_popup_two_tier').modal({backdrop: 'static', keyboard: false})
//            console.log($(thisObj).val());
//            htmlEle += "<label>Select Place of Appeal (Second Arbitration)<sup class='text-danger'>*</sup></label>";
//            htmlEle += "<select name='place_of_appeal' id='place_of_appeal' class='select2 inputtxt emptyValidation'><option value=''>Please Select</option>";
//            htmlEle += "<option value='Rajasthan'>Rajasthan</option></select><label class='errorMsg' id='place_of_appeal_error'></label>"
            $('.twoTeirDiv').show();
            $('#place_of_appeal').attr('disabled', false);
            $('#place_of_appeal_primary_id').attr('disabled', false);
        }

    }
});

$(document).on('change', '.userTypeCls', function (event) {
    var thisObj = $(this);
    var party_no = $(this).attr('party_no');
    var member_no = $(this).attr('member_no');

    var userTypeAlias = $(this).attr('userTypeAlias')

    $('.userTypeBehalf_' + party_no + '_' + member_no).html('');
    $('.userTypePowerOf_' + party_no + '_' + member_no).html('');
//        var userTypeAlias = $('option:selected', $(thisObj)).attr('userTypeAlias');
    var htmlFields = ''
    console.log(party_no, member_no, userTypeAlias)
    if (userTypeAlias == 'individual') {

        //htmlFields += "<div class='col-md-8 col-xs-12'><label> Business Name </label><input name='arbitration_agreement_party_members[party_no][member_no][business_name]' id='member_name_party_no_member_no' type='text' class='inputtxt emptyValidation' placeholder='complete name of business, you would like to mention on agreement'><label class='errorMsg' id='business_name_party_no_member_no_error'></label></div><div class='col-md-4 col-xs-12'><label> Through it's (Designation)</label><input name='arbitration_agreement_party_members[party_no][member_no][Designation]' id='Designationparty_no_member_no' type='text' class='inputtxt emptyValidation' placeholder='Director/ Partner/ Proprietor/ manager etc.'><label class='errorMsg' id='Designation_party_no_member_no_error'></label></div>";
        $('.userTypeBehalf_' + party_no + '_' + member_no).html(htmlFields);
        $('.name_of_party_member_title_' + party_no + '_' + member_no).html('Name of party<em>*</em>');
        $('.label_of_party_full_address_' + party_no + '_' + member_no).html('Full Address <sup class="text-danger">*</sup>');

    } else if (userTypeAlias == 'behalf_of_company') {

        $('.name_of_party_member_title_' + party_no + '_' + member_no).html('Name of Designated person<em>*</em>');

        htmlFields += "<div class='col-md-8 col-xs-12'><label> Business Name<em>*</em> </label><input name='arbitration_agreement_party_members[" + party_no + "][" + member_no + "][business_name]' id='business_name_" + party_no + '_' + member_no + "' type='text' class='inputtxt emptyValidation' placeholder='complete name of business, you would like to mention on agreement'><label class='errorMsg' id='business_name_" + party_no + '_' + member_no + "_error'></label></div><div class='col-md-4 col-xs-12'><label> Through it's (Designation)<em>*</em></label><input name='arbitration_agreement_party_members[" + party_no + "][" + member_no + "][designation]' id='designation_" + party_no + '_' + member_no + "' type='text' class='inputtxt emptyValidation' placeholder='Director/ Partner/ Proprietor/ manager etc.'><label class='errorMsg' id='designation_" + party_no + '_' + member_no + "_error'></label></div>";
        $('.userTypeBehalf_' + party_no + '_' + member_no).html(htmlFields);
        $('.label_of_party_full_address_' + party_no + '_' + member_no).html('Business Address <sup class="text-danger">*</sup>');

    } else if (userTypeAlias == 'power_of_attorney_holder') {

        htmlFields += "<div class='col-md-12 col-xs-12'><label> On the behalf of the power of Attorney of(Name with father Name, Age, Caste and Address)<em>*</em> </label><input name='arbitration_agreement_party_members[" + party_no + "][" + member_no + "][on_behalf_of]' id='on_behalf_of_" + party_no + '_' + member_no + "' type='text' class='inputtxt emptyValidation' placeholder='Name, Father name, Age, Caste and Address'><label class='errorMsg' id='on_behalf_of_" + party_no + '_' + member_no + "_error'></label></div>";
        $('.userTypePowerOf_' + party_no + '_' + member_no).html(htmlFields);
        $('.name_of_party_member_title_' + party_no + '_' + member_no).html('Name of Power of Attorney Holder<em>*</em>');
        $('.label_of_party_full_address_' + party_no + '_' + member_no).html('Full Address <sup class="text-danger">*</sup>');
    }

//        loadAgreementTypeContent(thisObj);
});

$(document).on('click', '.addMemberButton', function (event) {

    var thisObj = $(this);
    var party_no = $(this).attr('party_no');

    var member_no = $(this).attr('member_no');
    var member_no_plus = parseInt(member_no) + 1;
    $(this).attr('member_no', member_no_plus);
//        $('.memberCloseDivClass_' + party_no + '_' + member_no).remove();
    loadAgreementTypeContent(thisObj);
});

$(document).on('click', '.addPartyButton', function (event) {

    var thisObj = $(this);
    var party_no = $(this).attr('party_no');

    var member_no = $(this).attr('member_no');
//        var member_no_plus = parseInt(member_no) + 1;
    var party_no_plus = parseInt(party_no) + 1;
    $(this).attr('party_no', party_no_plus);

//        $('.partyCloseDivClass').remove();
    loadAgreementTypeContent(thisObj);

});

$(document).on('click', '.addWitnessButton', function (event) {

    var thisObj = $(this);
    var witness_no = $(this).attr('witness_no');

    if (witness_no == 1) {
        $('.witness_detail_button_div_2').show();
    }
    $('.witness_detail_button_div_' + witness_no).hide();


    if (witness_no == 2) {
        $('.witnessCloseDivClass_1').hide();
    } else {
        $('.witnessCloseDivClass_1').show();
    }

    loadAgreementTypeContent(thisObj);
});

function loadAgreementTypeContent(thisObj) {

    var destinationId = $(thisObj).attr('destinationId');
    var modelNames = $(thisObj).attr('modelNames');
    var renderTemplate = $(thisObj).attr('renderTemplate');
    var party_no = $(thisObj).attr('party_no');
    var member_no = $(thisObj).attr('member_no');
    var rendringType = $(thisObj).attr('rendringType');

    if ($(thisObj).attr('tabStatus') == 'second') {
        var formData = $('#formAgreement').serialize();
    }

    $.ajax({
        url: $(thisObj).attr('url'),
        data: {
            is_active: 1,
            modelNames: modelNames,
            renderTemplate: renderTemplate,
            party_no: party_no,
            member_no: member_no,
            formData: JSON.stringify(formData),
        },
        dataType: 'html',
        method: "POST",
        cache: false,
        success: function (response) {
            if (rendringType == 'htmlType') {
                $('#' + destinationId).html('');
                $('#' + destinationId).html(response).show('slow');
            } else if (rendringType == 'appendType') {
                $('#' + destinationId).append(response);
            }

            if ($(thisObj).val() == 'two') {
                $('.twoTeirDiv').show();
                $('#place_of_appeal').attr('disabled', false);
                $('#place_of_appeal_primary_id').attr('disabled', false);
            }
            if ($(thisObj).val() == 'single') {
//                $('.twoTeirDiv').html('');
                $('.twoTeirDiv').hide();
                $('#place_of_appeal').attr('disabled', true);
                $('#place_of_appeal_primary_id').attr('disabled', true);
            }

            //For Country drop down - selected India and primary id assign to hidden input
            $('.onChangeForPrimaryId').each(function (index, value) {
                var thisVar = $(this);
                var valueSelected = $('option:selected', thisVar).val();

                if (valueSelected == 'India') {
                    var primary_id_text = $(thisVar).attr('id');
                    var id_value = $('option:selected', thisVar).attr('primaryid');
                    $('#' + primary_id_text + '_primary_id').val(id_value);
                }
            });

            $('.partyNoTitleCount').each(function (index, value) {
                var indexVal = parseInt(index) + 1;
                $(this).text(indexVal);
            });

            //for bank login -- auto fill party form with bank information
            if ($(thisObj).hasClass('class_for_bank_detail')) {
                var formData = {};
                $.ajax({
                    url: '/admin/arbitration_agreements/get_complete_bank_details',
                    data: formData,
                    dataType: "json",
                    method: "POST",
                    cache: false,
                    success: function (response) {
                        console.log(response);
                        $('#member_name_1_1').val(response.user_detail.first_name);
                        $('#member_address_1_1').val(response.user_detail.residence_address);
                        $('#member_pincode_1_1').val(response.user_detail.pincode);
                        $('#member_mobile_number_1_1').val(response.user_detail.mobile);
                        $('#member_email_1_1').val(response.user_detail.email);
                        $('#member_aadhar_1_1').val(response.user_detail.aadhaar_number);
                        $('#member_country_id_1_1_primary_id').val(response.user_detail.country_id);
                        $('#member_state_id_1_1_primary_id').val(response.user_detail.state_id);
                        $('#member_division_id_1_1_primary_id').val(response.user_detail.division_id);
                        $('#member_district_id_1_1_primary_id').val(response.user_detail.district_id);
                        $('#member_tehsil_id_1_1_primary_id').val(response.user_detail.tehsil_id);

                        $('.memberCloseDivClass_1_1').remove();
                        $('.partyCloseDivClass').first().remove();

                        $('.userTypeCls_individual').remove();
                        $('.userTypeCls_power_of_attorney_holder').remove();
                        $('.userTypeCls_behalf_of_company input[type=radio]').attr('checked', true).trigger('change');

                        $('#member_state_id_1_1').html($('<option></option>').val('').html('--Please Select--'));
                        $.each(response.bank_detail.states, function (index, value) {
                            if (value.id == response.user_detail.state_id) {
                                var selected = true;
                            } else {
                                var selected = false;
                            }
                            $('#member_state_id_1_1').append($('<option></option>').val(value.state_name).html(value.state_name).attr('primaryId', value.id).attr('selected', selected));
                        });

                        $('#member_division_id_1_1').html($('<option></option>').val('').html('--Please Select--'));
                        $.each(response.bank_detail.divisions, function (index, value) {
                            if (value.id == response.user_detail.division_id) {
                                var selected = true;
                            } else {
                                var selected = false;
                            }
                            $('#member_division_id_1_1').append($('<option></option>').val(value.division_name).html(value.division_name).attr('primaryId', value.id).attr('selected', selected));
                        });

                        $('#member_district_id_1_1').html($('<option></option>').val('').html('--Please Select--'));
                        $.each(response.bank_detail.districts, function (index, value) {
                            if (value.id == response.user_detail.district_id) {
                                var selected = true;
                            } else {
                                var selected = false;
                            }
                            $('#member_district_id_1_1').append($('<option></option>').val(value.district_name).html(value.district_name).attr('primaryId', value.id).attr('selected', selected));
                        });

                        $('#member_tehsil_id_1_1').html($('<option></option>').val('').html('--Please Select--'));
                        $.each(response.bank_detail.tehsils, function (index, value) {
                            if (value.id == response.user_detail.tehsil_id) {
                                var selected = true;
                            } else {
                                var selected = false;
                            }
                            $('#member_tehsil_id_1_1').append($('<option></option>').val(value.tehsil_name).html(value.tehsil_name).attr('primaryId', value.id).attr('selected', selected));
                        });

                        $('#member_name_party_no_member_no').val(response.user_detail.user_busines_details.business_name);
//                        $('#member_name_party_no_member_no').val(response.user_detail.user_busines_details.business_name);
                    },
                    error: function (error) {
                        console.log(error)
                    }
                });
            }

            //for Deed Writer login -- auto fill stamp information if deal is freez
            if ($('#term_conditions').hasClass('classForDW')) {
                if (Object.keys(freezDealStampData).length !== 0) {
                    $('#stamp_number').val(freezDealStampData.freez_data.stamp_no);
                    $('#stamp_number').attr('readonly', true);

                    $('#agreement_value').val(freezDealStampData.freez_data.document_value);
                    $('#service_details_primary_id').val(freezDealStampData.freez_data.service_details_id);
                    $('#service_details_id option[primaryid=' + freezDealStampData.freez_data.service_details_id + ']').attr('selected', 'selected');

                    $('#service_detail_documents_id').html('');
                    $('#service_detail_documents_id').append($('<option></option>').val('').html('--Please Select--'));
                    $.each(freezDealStampData.service_detail_document, function (index, value) {
                        if (value.id == freezDealStampData.freez_data.service_detail_documents_id) {
                            var selected = true;
                        } else {
                            var selected = false;
                        }
                        $('#service_detail_documents_id').append($('<option></option>').val(value.documents_name).html(value.documents_name).attr('primaryId', value.id).attr('selected', selected));
                    });

                } else if (freezDealStampDataNotExist != '') {
                    $('#stamp_number').val(freezDealStampDataNotExist);
//                $('#stamp_number').attr('readonly', true);
                }
            }


        },
        error: function (data) {
//                    $('#loadingCenter').hide();
        },
        afterSuccess: function () {
//                    $('#loadingCenter').hide();
        }

    });

}






$(document).on('click', '.closeMember', function () {

    var party_no = $(this).attr('party_no');
    var member_no = $(this).attr('member_no');
    var member_no_minus = parseInt(member_no) - 1;



    var lengthMembers = $('#party_content_' + party_no + ' .member_content_class').length;
    console.log(lengthMembers);
    if (lengthMembers <= 1) {
        bootstrapNotify.showMessage('Atleast one member is required', 'danger');
    } else {
        $('.addMemberDiv_' + party_no + ' .addMemberButton_' + party_no).attr('member_no', member_no_minus);
        $('#member_content_' + party_no + '_' + member_no).slideUp(600, function () {
            $(this).remove();
        });
    }
//        if (member_no_minus > 0) {
//            var closeMemberDiv = "<a party_no='" + party_no + "' member_no='" + member_no_minus + "' href='javascript:void(0);' class='closeMember memberCloseDivClass_" + party_no + "_" + member_no_minus + "'><i class='fa fa-times-circle-o' aria-hidden='true'></i></a>";
//            $('#member_content_' + party_no + '_' + member_no_minus).prepend(closeMemberDiv);
//        }

});

$(document).on('click', '.closeParty', function () {


    var party_no = $(this).attr('party_no');
    var party_no_minus = parseInt(party_no) - 1;

    var lengthParties = $('#parties .party_content').length;

    if (lengthParties <= 2) {
        bootstrapNotify.showMessage('Atleast two parties are required', 'danger');
    } else {
//        $('.addPartyButton').attr('party_no', party_no_minus);
        $('#parties_' + party_no).slideUp(600, function () {
            $(this).remove();
            $('.partyNoTitleCount').each(function (index, value) {
                var indexVal = parseInt(index) + 1;
                $(this).text(indexVal);
            });
        });
    }



//        if (party_no_minus > 1) {
//            var closePartyDiv = "<a party_no='" + party_no_minus + "' href='javascript:void(0);' class='closeParty partyCloseDivClass'><i class='fa fa-times-circle-o' aria-hidden='true'></i></a>";
//            $('#parties_' + party_no_minus).prepend(closePartyDiv);
//        }
});


$(document).on('submit', '#formAgreement', function (e) {

//$(document).on('click', '#proceedToView', function () {

    e.preventDefault();
    var thisObj = $(this);
    $('.errorMsg').text('');
    var errorMessageObj = {};
//        randomEleIds = [];
    var errorStatus = false;
    //trim all input values
    $('input[type=text]').each(function (i, v) {
        $(this).val(v.value.trim().replace(/\s\s+/g, ' '));
    });
//         $('form').serializeArray();
//        var formData1 = $('#formAgreement').serializeArray();
    var form = $('#formAgreement')[0];
    var formData = new FormData(form);

    var parent_arbitration_agreements_period = $('#parent_arbitration_agreements_period').val();
    async.parallel([
        function (callback) {
            $('.emptyValidation').each(function (index, value) {
                var thisObj = $(this);
                if ($(thisObj).val() == '' || typeof $(thisObj).val() == 'undefined') {
                    console.log($(thisObj).val(), $(thisObj).attr('id'), $(thisObj).attr('class'));
                    var ids = $(thisObj).attr('id');
                    errorMessageObj[ids] = 'This field is required.';
                    errorStatus = true;
                } else if ($(thisObj).attr('type') == 'checkbox' && !$(thisObj).is(":checked")) {
                    var ids = $(thisObj).attr('id');
                    errorMessageObj[ids] = 'This field is required.';
                    errorStatus = true;
                }

            });
            callback('', null);
        },
        function (callback) {
            var allEmails = [];
            $('.emailValidation').each(function (index, value) {
                var thisObj = $(this);
                var ids = $(thisObj).attr('id');
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if ($(thisObj).val() != '' && !re.test($(thisObj).val())) {
                    errorMessageObj[ids] = 'Please Enter Valid Email';
                    errorStatus = true;
                } else if ($(thisObj).val() != '' && allEmails.indexOf($(thisObj).val()) >= 0) {
                    errorMessageObj[ids] = 'Email should be unique';
                    errorStatus = true;
                }
                allEmails.push($(thisObj).val());

            });
            callback('', null);
        },
        function (callback) {
            var allAadharNos = [];
            $('.aadharDigitValidation').each(function (index, value) {
                var thisObj = $(this);
                var ids = $(thisObj).attr('id');
                if ($(thisObj).val() != '' && $(thisObj).val().length != 12) {
                    errorMessageObj[ids] = 'Please Enter 12 digit';
                    errorStatus = true;
                } else if ($(thisObj).val() != '' && allAadharNos.indexOf($(thisObj).val()) >= 0) {
                    errorMessageObj[ids] = 'Aadhar number should be unique';
                    errorStatus = true;
                }
                allAadharNos.push($(thisObj).val());
            });
            callback('', null);
        },
        function (callback) {
            var allMobileNos = [];
            $('.mobileDigitValidation').each(function (index, value) {
                var thisObj = $(this);
                var ids = $(thisObj).attr('id');
                if ($(thisObj).val() != '' && $(thisObj).val().length != 10) {
                    errorMessageObj[ids] = 'Please Enter 10 digit';
                    errorStatus = true;
                } else if ($(thisObj).val() != '' && allMobileNos.indexOf($(thisObj).val()) >= 0) {
                    errorMessageObj[ids] = 'Mobile number should be unique';
                    errorStatus = true;
                }
                allMobileNos.push($(thisObj).val());
            });
            callback('', null);
        },
        function (callback) {
            var allGovtidNos = [];
            $('.govtIdValidation').each(function (index, value) {
                var thisObj = $(this);
                var ids = $(thisObj).attr('id');
                if ($(thisObj).val() != '' && allGovtidNos.indexOf($(thisObj).val()) >= 0) {
                    errorMessageObj[ids] = 'Govt Id should be unique';
                    errorStatus = true;
                }
                allGovtidNos.push($(thisObj).val());
            });
            callback('', null);
        },
    ], function (err) {
        console.log(errorMessageObj);
        //    errorStatus = false;
        if (errorStatus) {
            $.each(errorMessageObj, function (i, v) {
                bootstrapNotify.showMessageOnField(v, i);
            });
            $('.errorMsg').each(function (i, v) {
                if ($(this).text() != '') {

                    $('html, body').animate({
                        scrollTop: $(this).parent('div').find("label").offset().top
                    }, 1000);

                    return false;
                }
            });

//            $('html, body').animate({
//                scrollTop: $("#" + Object.keys(errorMessageObj)[0]).offset().top
//            }, 1000);
        } else {
            $.ajax({
                type: "POST",
                url: $(thisObj).attr('action'),
                data: formData,
                dataType: "json",
                processData: false,
                contentType: false,
                //json: true,
                cache: false,
                success: function (response) {
                    console.log(response);

                    var feeHtml = '';
                    var selectedYear;
                    $('.filterBarRight').hide();
                    var totalYearDocument = (parseInt(response.data.length) - 1) * 12;
                    $.each(response.data, function (i, v) {
                        console.log(i, response.yearDurationStampPlus, response.selectedYear);
                        if (i != 0 && response.yearDurationStampPlus >= i) {

                            if (response.yearDurationStampPlus == i) {
                                var checked = 'checked';
                                selectedYear = i;
                            } else {
                                var checked = '';
//                            selectedYear = 1;

                            }
                            feeHtml += "<div class='radio-btn'><input " + checked + " type='radio' class='feeValueRadio' year='" + i + "' name='fee' id='fee_" + i + "' value='" + v + "' > <label for='fee_" + i + "'>Upto " + parseInt(i) * 12 + " months FEE including all taxes Rs. " + v + "  </label></div>";
                        }

                    });
                    if (response.role_type_slug == 'deed_writer' && response.extraObjToView.creditPaymentStatus) {
                        var onCreditButton = "<button type='button' credit_type='1' id='PaymentOnCreditButton' style='' class='btn btn-primary'>Make Offline Payment</button>";
                    } else {
                        var onCreditButton = "";
                    }

                    if (response.results.parent_arbitration_agreements_id == 0) {
                        var backButton = "<a href='/admin/arbitration_agreements/edit/" + response.results.id + "/" + response.results.product_id + "' id='backButton--' class='btn btn-primary'>Back to Edit</a>";
                    } else {
                        var backButton = "";
                    }

                    if ($.inArray(response.results.service_details_id, response.extraObjToView.settingData.document_category_for_monthly_rent.split(',')) >= 0) {
                        var documentValueFlag = 'Monthly Lease Rent';
                    } else {
                        var documentValueFlag = 'Document Value';
                    }
                    var makePayment = "<div class='panel panel-default'><div class='panel-body'><h2>Arbitration Agreement Fee Details</h2><p>For Stamp number (" + response.results.stamp_number + ") and " + documentValueFlag + " Rs. " + response.results.agreement_value + " on dated " + moment(response.results.stamp_date).format('DD-MM-YYYY') + "  </p> <p>Nyaya Card will be issued for maximum " + totalYearDocument + " months</p>" + feeHtml + " <input type='hidden' class='' name='year_nayacard' id='year_nayacard' value='" + selectedYear + "' ><input type='hidden' class='' name='arbitration_id' id='arbitration_id' value='" + response.results.id + "' ><input type='hidden' class='' name='parent_arbitration_agreements_id' id='parent_arbitration_agreements_id' value='" + response.results.parent_arbitration_agreements_id + "' ><br><br>" + backButton + onCreditButton + "<button type='button' id='makePaymentButton' style='float: right;' class='btn btn-primary'>Make Payment</button></div></div>";
                    makePayment += "<input type='hidden' id='ProfessinalAPid' value='" + response.extraObjToView.ProfessinalAPid + "'>";
                    $.ajax({
                        type: "GET",
                        url: '/admin/arbitration_agreements/view_detail/' + response.results.id,
                        data: formData,
                        dataType: "html",
                        processData: false,
                        contentType: false,
                        cache: false,
                        success: function (response1) {
                            $('#tab2').html(response1);
                            $('#tab3').html(makePayment);
                            if (typeof parent_arbitration_agreements_period !== 'undefined') {
                                $('#tab3Li').trigger('click');
                                $('html, body').animate({
                                    scrollTop: $('#tab3').offset().top
                                }, 1000);
                            } else {
                                $('#tab2Li').trigger('click');
                                $('html, body').animate({
                                    scrollTop: $('.wrapperDoc').offset().top
                                }, 1000);
                            }
                            $('#tab1Li').show();
                            $('#tab2Li').show();
                        },
                    });
                },
                error: function (resData) {
                    if (typeof resData.responseJSON.msgType != 'undefined' && resData.responseJSON.msgType) {
                        bootstrapNotify.showMessage(resData.responseJSON.msg, 'danger');
                    } else {
                        $.each(resData.responseJSON.data, function (key, val) {
                            if (val.param != undefined) {
                                bootstrapNotify.showMessageOnField(val.message, val.path);
                            } else {
                                bootstrapNotify.showMessageOnField(val.message, val.path);
                            }
                        });

                        $('.errorMsg').each(function (i, v) {
                            if ($(this).text() != '') {

                                $('html, body').animate({
                                    scrollTop: $(this).parent('div').find("label").offset().top
                                }, 1000);

                                return false;
                            }
                        });
//                    $('html, body').animate({
//                        scrollTop: $("#" + resData.responseJSON.data[0].path).offset().top
//                    }, 1000);
                    }
                }

            });
        }

    });
});

$(document).on('click', '#submitView', function () {

    var form = $('#formAgreement')[0];
    var formData = new FormData(form);
    $.ajax({
        type: "POST",
        url: '/admin/arbitration_agreements/submit_agreement',
        data: formData,
        dataType: "json",
        processData: false,
        contentType: false,
        //json: true,
        cache: false,
        success: function (response) {
            console.log('response 3234446575657463');
            console.log(response);
            $('#tab3Li').trigger('click');
//                bootstrapNotify.showMessage('success', 'Successfully submitted.');
//                $('#tab1Li').hide();
//                $('#tab2Li').hide();
            $('#tab3').html('');
            $('#tab3').html(response);

//                $.ajax({
//                    url: response.url,
//                    data: {
//                        arbitration_id: response.arbitration_id,
//                    },
//                    dataType: 'html',
//                    method: "POST",
//                    cache: false,
//                    success: function (response1) {
//                        $('.nav-pills').remove();
//                        $('#tab1Li').remove();
//                        $('#tab2Li').remove();
//                        $('#tab3').html('');
//                        $('#tab3').html(response1);
//                    }
//                });
        },
        error: function (resData) {
            $('#tab3Li').trigger('click');
            $('#tab3').html('');
            $('#tab3').html(resData.responseText);
            //bootstrapNotify.showMessage('Please try again.', 'success');
            console.log(resData.responseText);
        }

    });
});

$(document).on('click', '.feeValueRadio', function () {
    $('#year_nayacard').val($(this).attr('year'));
    $('#confirmation_checkbox').attr('checked', false);
});



$(document).on('change', '#service_details_id', function () {
    var thisObj = $(this);
    $('#service_details_primary_id').val($("option:selected", thisObj).attr('primaryId'));

    var settingValueArr = $('.settingValueForMonthlyRent').text().split(',');
    if ($.inArray($("option:selected", thisObj).val(), settingValueArr) >= 0) {
        $('.document_value_month_class').text('Monthly Lease Rent');
    } else {
        $('.document_value_month_class').text('Document Value');
    }

    var settingValueArrForPopUp = $('.settingValueForPopUp').text().split(',');
    if ($.inArray($("option:selected", thisObj).val(), settingValueArrForPopUp) >= 0) {
        $('#myModal_confirm_popup_nc').modal({backdrop: 'static', keyboard: false})
    } else {
        //$('.document_value_month_class').text('Document Value');
    }
});

$(document).on('click', '#gotoFeeDetail', function () {
    $('#tab3Li').click();
    $('html, body').animate({
        scrollTop: $('#tab3').offset().top
    }, 1000);
});

$(document).on('click', '#makePaymentButton', function () {

    $.ajax({
        type: "POST",
        url: '/admin/arbitration_agreements/update_fee',
        data: {
            id: $('#arbitration_id').val(),
            year_nayacard: $('#year_nayacard').val(),
            fee: $('input[name=fee]:checked').val(),
            ProfessinalAPid: $('#ProfessinalAPid').val(),
            parent_arbitration_agreements_id: $('#parent_arbitration_agreements_id').val(),
        },
        dataType: "json",
        cache: false,
        success: function (response) {
            if (response.status) {
                window.location.href = response.url;
            }
        },
        error: function (response) {
//            console.log(response)
//            console.log(response.responseText)
//            if (!response.responseText.status) {
//                console.log('23424')
//                window.location.href = response.responseText.url;
//            }
        }
    });

});

$(document).on('click', '#PaymentOnCreditButton', function () {
    $('#myModal_confirm_popup').modal()
});

$(document).on('click', '#saveAsDraft', function () {

    $('.errorMsg').text('');
    var errorStatus = false;
    var errorMessageObj = {};
    //trim all input values
    $('input[type=text]').each(function (i, v) {
        $(this).val(v.value.trim().replace(/\s\s+/g, ' '));
    });

    async.parallel([
        function (callback) {
            var allEmails = [];
            $('.emailValidation').each(function (index, value) {
                var thisObj = $(this);
                var ids = $(thisObj).attr('id');
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if ($(thisObj).val() != '' && !re.test($(thisObj).val())) {
                    errorMessageObj[ids] = 'Please Enter Valid Email';
                    errorStatus = true;
                } else if ($(thisObj).val() != '' && allEmails.indexOf($(thisObj).val()) >= 0) {
                    errorMessageObj[ids] = 'Email should be unique';
                    errorStatus = true;
                }
                allEmails.push($(thisObj).val());

            });
            callback('', null);
        },
        function (callback) {
            var allAadharNos = [];
            $('.aadharDigitValidation').each(function (index, value) {
                var thisObj = $(this);
                var ids = $(thisObj).attr('id');
                if ($(thisObj).val() != '' && $(thisObj).val().length != 12) {
                    errorMessageObj[ids] = 'Please Enter 12 digit';
                    errorStatus = true;
                } else if ($(thisObj).val() != '' && allAadharNos.indexOf($(thisObj).val()) >= 0) {
                    errorMessageObj[ids] = 'Aadhar number should be unique';
                    errorStatus = true;
                }
                allAadharNos.push($(thisObj).val());
            });
            callback('', null);
        },
        function (callback) {
            var allMobileNos = [];
            $('.mobileDigitValidation').each(function (index, value) {
                var thisObj = $(this);
                var ids = $(thisObj).attr('id');
                if ($(thisObj).val() != '' && $(thisObj).val().length != 10) {
                    errorMessageObj[ids] = 'Please Enter 10 digit';
                    errorStatus = true;
                } else if ($(thisObj).val() != '' && allMobileNos.indexOf($(thisObj).val()) >= 0) {
                    errorMessageObj[ids] = 'Mobile number should be unique';
                    errorStatus = true;
                }
                allMobileNos.push($(thisObj).val());
            });
            callback('', null);
        },
        function (callback) {
            var allGovtidNos = [];
            $('.govtIdValidation').each(function (index, value) {
                var thisObj = $(this);
                var ids = $(thisObj).attr('id');
                if ($(thisObj).val() != '' && allGovtidNos.indexOf($(thisObj).val()) >= 0) {
                    errorMessageObj[ids] = 'Govt Id should be unique';
                    errorStatus = true;
                }
                allGovtidNos.push($(thisObj).val());
            });
            callback('', null);
        },
        function (callback) {
            var thisObj = $(this);
            var partyFlag = $(this).attr('party');
            var memberFlag = $(this).attr('member');
            var id_number_value = $('.govt_id_number_class' + '_' + partyFlag + '_' + memberFlag).val();
            var id_number_id = $('.govt_id_number_class' + '_' + partyFlag + '_' + memberFlag).attr('id');
            if ($('option:selected', $(thisObj)).val() == 'pan_number') {
                if ((id_number_value != '') && ((id_number_value.length != 10) || !isNaN(id_number_value.substring(0, 5)) || isNaN(id_number_value.substring(5, 9)) || !isNaN(id_number_value.substring(9, 10)))) {
                    errorMessageObj[id_number_id] = 'Please Enter Valid PAN Card Number';
//                 console.log(id_number_value, id_number_id);
                    errorStatus = true;
                }
            }
            callback('', null);
        },
        function (callback) {
            var agreementPlaceVal = $('#agreement_place').val().replace(/ /g, '');
            if (!/^[a-zA-Z]*$/.test(agreementPlaceVal)) {
                var ids = $('#agreement_place').attr('id');
                errorMessageObj[ids] = 'Please Enter Valid Place';
                errorStatus = true;
            }
            callback('', null);
        },
    ], function (err) {

        //    errorStatus = true;
        if (errorStatus) {
            $.each(errorMessageObj, function (i, v) {
                bootstrapNotify.showMessageOnField(v, i);
            });
            $('html, body').animate({
                scrollTop: $("#" + Object.keys(errorMessageObj)[0]).offset().top
            }, 1000);
        } else {
            var form = $('#formAgreement')[0];
            var formData = new FormData(form);

            $.ajax({
                type: "POST",
                url: '/admin/arbitration_agreements/save_as_draft',
                data: formData,
                dataType: "json",
                processData: false,
                contentType: false,
                //json: true,
                cache: false,
                success: function (response) {
                    if (response.status) {
                        window.location.href = response.url;
                    }
                },
                error: function (resData) {
                    if (typeof resData.responseJSON.msgType != 'undefined' && resData.responseJSON.msgType) {
                        bootstrapNotify.showMessage(resData.responseJSON.msg, 'danger');
                    } else {
                        $.each(resData.responseJSON.data, function (key, val) {
                            if (val.param != undefined) {
                                bootstrapNotify.showMessageOnField(val.message, val.path);
                            } else {
                                bootstrapNotify.showMessageOnField(val.message, val.path);
                            }
                        });

                        $('.errorMsg').each(function (i, v) {
                            if ($(this).text() != '') {

                                $('html, body').animate({
                                    scrollTop: $(this).parent('div').find("label").offset().top
                                }, 1000);

                                return false;
                            }
                        });
                    }
//                bootstrapNotify.showMessage(resData.responseJSON.msg, 'danger');
                }

            });
        }

    });

});

$(document).on('click', '.witnessCloseDivClass', function () {

    var witness_no = $(this).attr('witness_no');
    if (witness_no == 1) {
        $('.witness_detail_button_div_2').hide();
    }

    if (witness_no == 2) {
        $('.witnessCloseDivClass_1').show();
    }
//    $('#witness_detail_' + witness_no).hide('slow')
    $('#witness_detail_' + witness_no + ' div').slideUp(600, function () {
        $(this).remove();
    });

    $('.witness_detail_button_div_' + witness_no).show()
});

$(document).on('click', '#backButton', function () {
    $('#tab1Li').click();
});

$(document).on('submit', '#preFormAgreement', function (e) {

    e.preventDefault();
    $('.errorMsg').text('');
    $('#pre_stamp_number').val($('#pre_stamp_number').val().trim().replace(/\s\s+/g, ' '));
    var form = $('#preFormAgreement')[0];
    var formData = new FormData(form);

    if ($('#pre_stamp_number').val() == '') {
        bootstrapNotify.showMessageOnField('This field is required', 'pre_stamp_number');
        $('.stamp_detail_msg').html('');
    } else {
        $.ajax({
            type: "POST",
            url: '/admin/arbitration_agreements/pre_stamp_check',
            data: formData,
            dataType: "json",
            processData: false,
            contentType: false,
            //json: true,
            cache: false,
            success: function (response) {
                console.log(response);
                if (response.status) {
                    freezDealStampData = response;
                    $('#stamp_number').val(response.freez_data.stamp_no);
                    $('#stamp_number').attr('readonly', true);

                    $('#agreement_value').val(response.freez_data.document_value);
                    $('#service_details_id option[primaryid=' + response.freez_data.service_details_id + ']').attr('selected', 'selected');

                    $('#service_detail_documents_id').html('');
                    $('#service_detail_documents_id').append($('<option></option>').val('').html('--Please Select--'));
                    $.each(response.service_detail_document, function (index, value) {
                        if (value.id == response.freez_data.service_detail_documents_id) {
                            var selected = true;
                        } else {
                            var selected = false;
                        }
                        $('#service_detail_documents_id').append($('<option></option>').val(value.documents_name).html(value.documents_name).attr('primaryId', value.id).attr('selected', selected));
                    });

                    var stamp_detail_msg = '<div class="col-md-12 col-xs-9"><p>This Stamp Number is locked by <strong> Mr. ' + response.freez_data.users.first_name + ' (' + response.freez_data.users.users_role_type.role_type_name + ') </strong> and its <strong> ' + response.freez_data.year + ' years </strong> fee is <strong> Rs. ' + response.freez_data.fee + ' </strong></p></div><div class="col-md-3 col-xs-12"><label>&nbsp;</label><input type="button" class="btn btn-primary inputtxt proceed_from_stamp" value="Proceed"></div>';
                    $('.stamp_detail_msg').html(stamp_detail_msg);
                }
            },
            error: function (resData) {
                if (resData.responseJSON.status_flag == 'exists') {
                    var stamp_detail_msg = '<div class="col-md-12 col-xs-9"><p>Nayaya card already exist with this stamp number. You cannot create new one</p></div>';
                    $('.stamp_detail_msg').html(stamp_detail_msg);
                } else {

                    freezDealStampDataNotExist = $('#pre_stamp_number').val();
//                    $('#stamp_number').val($('#pre_stamp_number').val());
//                    $('#stamp_number').attr('readonly', false);
//                    $('#agreement_value').val('');
//                    $('#service_details_id option[value=""]').attr('selected', 'selected');
//                    $('#service_detail_documents_id').html('');
//                    $('#service_detail_documents_id').append($('<option></option>').val('').html('--Please Select--'));

                    var stamp_detail_msg = '<div class="col-md-12 col-xs-9"><p>This Stamp number is not locked with any professional. You can proceed for Nyaya Card.</p></div><div class="col-md-3 col-xs-12"><label>&nbsp;</label><input type="button" class="btn btn-primary inputtxt proceed_from_stamp" value="Create Nyaya Card"></div>';
                    $('.stamp_detail_msg').html(stamp_detail_msg);
                }
            }

        });
    }

});

$(document).on('click', '.proceed_from_stamp', function () {
    $('#tab1Li').click();
});

$(document).on('change', '#confirmation_checkbox_popup', function () {
    $('#myModal_confirm_popup_nc').modal('hide');
    $('#confirmation_checkbox_popup').attr('checked', false);
});
$(document).on('change', '#confirmation_checkbox_popup_single_tier', function () {
    $('#myModal_confirm_popup_single_tier').modal('hide');
    $('#confirmation_checkbox_popup_single_tier').attr('checked', false);
});
$(document).on('change', '#confirmation_checkbox_popup_two_tier', function () {
    $('#myModal_confirm_popup_two_tier').modal('hide');
    $('#confirmation_checkbox_popup_two_tier').attr('checked', false);
});

$(document).on('change', '#confirmation_checkbox', function () {
    if (this.checked) {
        $.ajax({
            type: "POST",
            url: '/admin/arbitration_agreements/payment_on_credit',
            data: {
                id: $('#arbitration_id').val(),
                year_nayacard: $('#year_nayacard').val(),
                fee: $('input[name=fee]:checked').val(),
                ProfessinalAPid: $('#ProfessinalAPid').val(),
            },
            dataType: "json",
            cache: false,
            success: function (response) {
                if (response.status) {
                    window.location.href = response.url;
                }
            },
            error: function (resData) {
                bootstrapNotify.showMessage(resData.responseJSON.message);
                $('#myModal_confirm_popup').modal('hide');
                $('#confirmation_checkbox').attr('checked', false);
            }
        });
    } else {
        $('#myModal_confirm_popup').modal('hide');
        $('#confirmation_checkbox').attr('checked', false);
    }
});
//$(document).on('blur', '#stamp_number', function () {
//    var thisObj = $(this);
//    $.ajax({
//        type: 'POST',
//        url: '/admin/arbitration_agreements/stamp_exist',
//        data: {stamp_number: $(thisObj).val()},
//        success: function (response) {
//
//        },
//        error: function (resData) {
//            bootstrapNotify.showMessage(resData.responseJSON.msg, 'danger');
//        }
//    });
//
//});

