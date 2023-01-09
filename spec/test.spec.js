//const {Builder, By, Key, until} = require('selenium-webdriver')
//require('chromedriver')

import {Builder, By, Key, until} from 'selenium-webdriver'
import 'chromedriver'

let page = {
        login : {
            usernameInput : 'username',
            passwordInput : 'password',
            loginBtn : '/html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[3]/button'
        },
        main : {
            sideMenu : {
                adminLink : 'Admin'
            },
            admin : {
                topNavBar : {
                    jobNavBtn : '/html/body/div/div[1]/div[1]/header/div[2]/nav/ul/li[2]',
                    jobNavList : {
                        workshiftLink : 'Work Shifts'
                    }
                },
                workshift : {
                    addBtn : '/html/body/div/div[1]/div[2]/div[2]/div/div/div[1]/div/button',
                    tableContent : '.oxd-table-cell>div',
                    deleteSelectedBtn : '/html/body/div/div[1]/div[2]/div[2]/div/div/div[2]/div/div/button',
                    confirmDeleteBtn : '/html/body/div/div[3]/div/div/div/div[3]/button[2]'
                },
                addWorkshift : {
                    nameInput : '//*[@id="app"]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div/div/div[2]/input',
                    fromTimeInput : '/html/body/div/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[1]/div/div[2]/div/div/input',
                    toTimeInput : '/html/body/div/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[2]/div/div[2]/div/div[1]/input',
                    assEmpInput : '/html/body/div/div[1]/div[2]/div[2]/div/div/form/div[3]/div/div/div/div[2]/div/div[1]/input',
                    propEmp : 'oxd-autocomplete-dropdown',
                    saveBtn : '/html/body/div/div[1]/div[2]/div[2]/div/div/form/div[4]/button[2]'
                }
            }
        }
}

async function test_case(){
    let driver = await new Builder().forBrowser('chrome').build()
    let flags = {
        login : 0,
        goingToWorkshift : 0,
        adding : 0,
        audit: 0,
        deleting: 1
    }
    try{
        await driver.get('https://opensource-demo.orangehrmlive.com/')

        await driver.wait(until.elementLocated(By.name(page.login.usernameInput)), 10000).sendKeys('Admin')
        await driver.wait(until.elementLocated(By.name(page.login.passwordInput)), 10000).sendKeys('admin123')
        await driver.wait(until.elementLocated(By.xpath(page.login.loginBtn)), 10000).click()

        flags.login = 1

        await driver.wait(until.elementLocated(By.partialLinkText(page.main.sideMenu.adminLink)), 10000).click()
        await driver.wait(until.elementLocated(By.xpath(page.main.admin.topNavBar.jobNavBtn)), 10000).click()
        await driver.wait(until.elementLocated(By.partialLinkText(page.main.admin.topNavBar.jobNavList.workshiftLink)), 10000).click()
        await driver.wait(until.elementLocated(By.xpath(page.main.admin.workshift.addBtn)), 10000).click()

        flags.goingToWorkshift = 1

        await driver.wait(until.elementLocated(By.xpath(page.main.admin.addWorkshift.nameInput)), 10000).sendKeys('StanislavStefyuk');

        await driver.wait(until.elementLocated(By.xpath(page.main.admin.addWorkshift.fromTimeInput)), 10000).clear();
        await driver.wait(until.elementLocated(By.xpath(page.main.admin.addWorkshift.fromTimeInput)), 10000).sendKeys('06:00 AM');
        await driver.wait(until.elementLocated(By.xpath(page.main.admin.addWorkshift.toTimeInput)), 10000).clear();
        await driver.wait(until.elementLocated(By.xpath(page.main.admin.addWorkshift.toTimeInput)), 10000).sendKeys('06:00 PM');
    
        await driver.wait(until.elementLocated(By.xpath(page.main.admin.addWorkshift.assEmpInput)), 10000).sendKeys('Odis Adalwi');
        
        setTimeout(async ()=>{
            await driver.wait(until.elementLocated(By.className(page.main.admin.addWorkshift.propEmp)), 10000).click()
            .then(()=>{
                driver.wait(until.elementLocated(By.xpath(page.main.admin.addWorkshift.saveBtn)), 10000).click()
            })
        },3000);
        
        flags.adding = 1
        
        let list = await driver.wait(until.elementsLocated(By.css(page.main.admin.workshift.tableContent), 10000))
        for(let i = 0; i < list.length; i++){
            let text1 = await list[i].getText()
            if(text1 === 'StanislavStefyuk'){
                let text2 = await list[i+1].getText()
                if(text2 === '06:00'){
                    let text3 = await list[i+2].getText()
                    if (text3 === '18:00'){
                        flags.audit = 1
                        await list[i-1].click()
                        break
                    }
                }
            }
        }
        await driver.wait(until.elementLocated(By.xpath(page.main.admin.workshift.deleteSelectedBtn))).click()
        await driver.wait(until.elementLocated(By.xpath(page.main.admin.workshift.confirmDeleteBtn))).click()
        list = await driver.wait(until.elementsLocated(By.css(page.main.admin.workshift.tableContent), 10000))
        for(let i = 0; i < list.length; i++){
            let text1 = await list[i].getText()
            if(text1 === 'RandomName'){
                flags.deleting = 0
            }
        }

    }finally{
        driver.quit()
        return flags
    }
    
}

let flags = await test_case()

describe('Testing steps: ', () => {
    it('First step: Logging in', ()=>{
        expect(flags.login).toBe(1)
    })
    it('Second step: Going to Adding Workshift form', ()=>{
        expect(flags.goingToWorkshift).toBe(1)
    })
    it('Third step: Filling form and saving workshift', ()=>{
        expect(flags.adding).toBe(1)
    })
    it('Fourth step: Checking workshifts', ()=>{
        expect(flags.audit).toBe(1)
    })
    it('Fifth step: Deleting', ()=>{
        expect(flags.deleting).toBe(1)
    })
})




