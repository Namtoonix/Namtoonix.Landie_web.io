const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
// Xử lý nav-more trên Phone
const navMoreBtn = $('.nav-more');
const navLeft = $$('#nav .nav-left-item');
const isMore = false;

navMoreBtn.onclick = function() {
    if (!isMore) {
        isMore = true;
        for (var i = 0; i < navLeft.length; i++) {
            navLeft[i].style.display = 'flex';
        }
    } else {
        isMore = false;
        for (var i = 0; i < navLeft.length; i++) {
            navLeft[i].style.display = 'none';
        }
    }
}
// Xử lý page-more
const moreBtn = $('.more-btn')
const pageMore = $('.new-box-container')
const closeBtns = $$('.close-btn')
const nextBtn = $('.next-btn');
const prevBtn = $('.prev-btn');
const pageElement = $$('.new-page');
var currentPage = 0;

// 1. xử lý mở - đóng
var isOpened = false;
moreBtn.onclick = function() {
    if (!isOpened) {
        isOpened = true;
        pageMore.classList.add('is-opened');
    } 
}
for (var closeBtn of closeBtns) {
    closeBtn.onclick = function() {
        if (isOpened) {
            isOpened = false;
            pageMore.classList.remove('is-opened');
            payPage.classList.remove('is-opened');
        } 
    }
}
// 2. xử lý next - prev page
function handleHidden() {
    pageElement[currentPage].classList.add('is-hidden');
}
nextBtn.onclick = function(e) {
    pageElement[currentPage].classList.remove('is-hidden');
    currentPage = currentPage < pageElement.length - 1 ? currentPage + 1 : 0;
    handleHidden(currentPage);
}
prevBtn.onclick = function(e) {
    pageElement[currentPage].classList.remove('is-hidden');
    currentPage = currentPage > 0 ? currentPage - 1 : pageElement.length -1;
    handleHidden(currentPage);
}

const paymentsBtn = $$('.payment');
const payPage = $('.payment-background');
for (var paymentBtn of paymentsBtn) {
    paymentBtn.onclick = function() {
        if (!isOpened) {
            isOpened = true;
            payPage.classList.add('is-opened');
        } 
    }
}

function validator(options) {

    var selectorRules = {};

    function validate(inputElement, rule) {

        var errorMessage;
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        console.error(errorElement)
        // Lấy ra các rule của selector
        var rules = selectorRules[rule.selector]

        // Lặp qua từng rule và kiểm tra
        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage
            inputElement.parentElement.classList.add('invalid')
        } else {
            errorElement.innerText = ''
            inputElement.parentElement.classList.remove('invalid')
        }

        return !errorMessage;
    };
    var formElement = document.querySelector(options.form)
    if (formElement) {
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;
            // Thực hiện lặp qua từng rule
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });
            
            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                    var formValues = Array.from(enableInputs).reduce(function(value, input) {
                        return (value[input.name] = input.value) && value;
                    }, {});
                    options.onSubmit(formValues);
                }
            }
        }

        // Xử lý lặp qua mỗi rules
        options.rules.forEach(function (rule) {

            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector)
            var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
            
            if (inputElement) {
                // Xử lý khi blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement, rule)
                }

                // Xử lý khi đang nhập vào input
                inputElement.oninput = function () {
                    errorElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        })
    }
}

// Định nghĩa các rules 
// Nguyên tắc của các rules: 
// 1.Khi có lỗi => trả ra message lỗi
// 2.Khi không có lỗi => trả ra undefine


validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || 'Please enter 12 codes on the card'
        }
    }
}

