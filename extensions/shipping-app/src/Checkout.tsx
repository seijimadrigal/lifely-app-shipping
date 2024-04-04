import {
  Heading,
  BlockStack,
  BlockSpacer,
  InlineLayout,
  ChoiceList,
  Choice,
  Button,
  Modal,
  View,
  DatePicker,
  Text,
  useApi,
  useTranslate,
  reactExtension,
  useApplyCartLinesChange,
  useCartLines,
  useApplyNoteChange,
  useShippingAddress,
  
} from '@shopify/ui-extensions-react/checkout';

import { useEffect,useState } from 'react';

import {getDeliveryDays,getDeliveryTimes, getDisabledDays, setCustomerState, convertMonth, convertWeekDay,forwardtoAvailableDate,convDateString,removeMonthBefore} from './DayChecker';

export default reactExtension(
  'purchase.checkout.shipping-option-list.render-after',
  () => <Extension />,
);

 

function Extension() {
  const translate = useTranslate();
  
  const {ui} = useApi();
  const applyCartLineChange = useApplyCartLinesChange();
  const noteChange = useApplyNoteChange()
  const cartLines = useCartLines();
  let disabledDates:Array<String> = [];

  // User Selected Delivery and Insurance Options
  const [selectedDelivery, setSelectedDelivery] = useState('delivery-one')
  const [selectedProtection, setSelectedProtection] = useState('protection-one')
  const [selectedDeliveryPrice, setSelectedDeliveryPrice] = useState('Free')


  // User Selected Dates
  const [selectedDate, setSelectedDate] = useState(convDateString(new Date()))
  const [savedDate, setSavedDate] = useState(selectedDate);
  const [earliestDate, setEarliestDate] = useState(selectedDate)


  // Google Sheets Date & Times 
  const [deliverTime,setDeliveryTime] = useState([]);
  const [deliverDays ,setDeliveryDays] = useState([]);
  const [disabledDays ,setDisabledDays] = useState([]);

  const customer_state = useShippingAddress().provinceCode;

  const savedDateVar = new Date(savedDate);
  const [savedWeekDay, setsavedWeekDay] = useState(convertWeekDay(savedDateVar.getDay()));
  const [savedDateNum, setsavedDateNum] = useState(savedDateVar.getDate());
  const [savedDateMonth, setsavedDateMonth] =useState(convertMonth(savedDateVar.getMonth()));

  const [toggleEarlyDateView,setToggleEarlyDateView] = useState(false);
  // DEV VARIANT IDs

  // const ROOM_SERVICE_VARIANT_ID = "gid://shopify/ProductVariant/41228554895465"
  // const PREMIUM_SERVICE_VARIANT_ID = "gid://shopify/ProductVariant/41228554928233"

  // const LIFELY_CARE_VARIANT_ID = "gid://shopify/ProductVariant/41233913020521"
  // const LIFELY_PLUS_VARIANT_ID = "gid://shopify/ProductVariant/41233913053289"

  // LIFELY STAGING VAR ID

  const ROOM_SERVICE_VARIANT_ID = "gid://shopify/ProductVariant/47992127422760"
  const PREMIUM_SERVICE_VARIANT_ID = "gid://shopify/ProductVariant/47992127488296"

  const LIFELY_CARE_VARIANT_ID = "gid://shopify/ProductVariant/47992175919400"
  const LIFELY_PLUS_VARIANT_ID = "gid://shopify/ProductVariant/47992175952168"
  
  
  useEffect(() => {
      checkLoadedDeliveryAndProtection()
  }, [])

  // Updates Values when user changes delivery preference 

  useEffect(() => {
    console.log("saved time ",savedDate);
    console.log("earliest time ",earliestDate);


    var savedDateVar = new Date(savedDate);

    setsavedWeekDay(convertWeekDay(savedDateVar.getDay()));
    setsavedDateNum(savedDateVar.getDate());
    setsavedDateMonth(convertMonth(savedDateVar.getMonth()));

      if(savedDate == earliestDate){
        setToggleEarlyDateView(true);
      }else{
        setToggleEarlyDateView(false);
      }

      updateCartNote(savedDate)
    
  }, [savedDate,deliverTime])
  
  // Loads if customer address changes 

  useEffect(() => {

    setCustomerState(customer_state)

    setTimeout(() => {
      
      // Saves the values of Google Sheet Available Times and Days

      setDeliveryDays(getDeliveryDays())
      setDeliveryTime(getDeliveryTimes())

      // Check the next available days starting from the next day

      console.log("Current Day", selectedDate)
      const forwardedSelectedDay = forwardtoAvailableDate(selectedDate,1)

      console.log("Saved Day ", forwardedSelectedDay)
      setSelectedDate(forwardedSelectedDay)
      setEarliestDate(forwardedSelectedDay);

      setSavedDate(forwardedSelectedDay);

      // ADDS THE DISABLED DATES AND WEEKDAYS 

      var disabledWeekDays = getDisabledDays();
      var combine_dates = disabledWeekDays.concat(removeMonthBefore(forwardedSelectedDay))
      console.log("disabled days ",combine_dates)
      setDisabledDays(combine_dates)


    }, 800);
  }, [customer_state])

  function checkLoadedDeliveryAndProtection(){
      cartLines.forEach(cart => {
       if(cart.merchandise.id === ROOM_SERVICE_VARIANT_ID){
          setSelectedDelivery('delivery-two')
        }  
       if(cart.merchandise.id === PREMIUM_SERVICE_VARIANT_ID){
          setSelectedDelivery('delivery-three')
        } 
       if(cart.merchandise.id === LIFELY_CARE_VARIANT_ID){
          setSelectedProtection('protection-two')
        }  
       if(cart.merchandise.id === LIFELY_PLUS_VARIANT_ID){
           setSelectedProtection('protection-three')
        } 
        })

  }

  

  function switchDeliveryCart(merch_id , prev_merch_id){

    var cart_product_var_1 = null;
    var cart_product_var_2 = null;

    if(merch_id === null){
      cartLines.forEach(product => {
       if(product.merchandise.id === prev_merch_id){
          cart_product_var_2 = product
        }
         })
        if(cart_product_var_2){
          applyCartLineChange({
            type:'removeCartLine',
            quantity:cart_product_var_2.quantity,
            id:cart_product_var_2.id })
        }
     
    }else{

        cartLines.forEach(product => {
          if(product.merchandise.id === merch_id){
            console.log("cart 1 exist")

            cart_product_var_1 = product
          } if(product.merchandise.id === prev_merch_id){
            console.log("cart 2 exist")

            cart_product_var_2 = product
          }
        })
          
        if(!cart_product_var_1){
          console.log("merch id " + merch_id)
          console.log("prev id " + prev_merch_id)

          if(cart_product_var_2){

              applyCartLineChange({
              type:'removeCartLine',
              quantity:1,
              id:cart_product_var_2.id, }).then((resolve) => {
                if(resolve){
                    applyCartLineChange({
                      type:'addCartLine',
                      quantity:1,
                      merchandiseId: merch_id})
                 
                }
              })
            }else{
              applyCartLineChange({
                type:'addCartLine',
                quantity:1,
                merchandiseId: merch_id})
           
            }
             
          } 
        }
  }

  function changeDeliveryOption(selected:string){
    if(selected != selectedDelivery){
      switch(selected){

        case "delivery-one":
          setSelectedDeliveryPrice('FREE');
          if(selectedDelivery === "delivery-two"){
            switchDeliveryCart(null,ROOM_SERVICE_VARIANT_ID)
          }else if(selectedDelivery === "delivery-three") {
            switchDeliveryCart(null,PREMIUM_SERVICE_VARIANT_ID)

          }
          break;
        case "delivery-two":
          setSelectedDeliveryPrice('$25');
          switchDeliveryCart(ROOM_SERVICE_VARIANT_ID,PREMIUM_SERVICE_VARIANT_ID)
          break;

        case "delivery-three":
          setSelectedDeliveryPrice('$75');
          switchDeliveryCart(PREMIUM_SERVICE_VARIANT_ID,ROOM_SERVICE_VARIANT_ID)
          break;

    }
    }
      setSelectedDelivery(selected)
  }

  function changeProtecOption(selected:string){

    if(selected != selectedProtection){
      switch(selected){
        case "protection-one":
          if(selectedProtection === "protection-two"){
            switchDeliveryCart(null,LIFELY_CARE_VARIANT_ID)
          }else if(selectedProtection === "protection-three") {
            switchDeliveryCart(null,LIFELY_PLUS_VARIANT_ID)

          }
          break;
        case "protection-two":
          switchDeliveryCart(LIFELY_CARE_VARIANT_ID,LIFELY_PLUS_VARIANT_ID)
          break;

        case "protection-three":
          switchDeliveryCart(LIFELY_PLUS_VARIANT_ID,LIFELY_CARE_VARIANT_ID)
          break;

    }
    }
      setSelectedProtection(selected)
  }



  function updateCartNote(dateString : string){
    if(savedDate && deliverTime != undefined){
      var notedDate = new Date(dateString);
      const monthString = convertMonth(notedDate.getMonth())
      
  
      const noteString = "Preferred Delivery Date: " + notedDate.getDate() +" " + monthString + " " + notedDate.getFullYear() + " Preferred Time: " + deliverTime[0] + " to " + deliverTime[deliverTime.length-1];
      console.log(noteString);
      noteChange({type:'updateNote',note:noteString}).then((result)=>{
          console.log("Note Updated " ,result)
      })
    }
  

  }


  return (<>
      <BlockSpacer spacing="tight" />
    <Heading level={2}>Choose Delivery Options</Heading> 
    <BlockSpacer spacing="tight" />

    <BlockStack>
      <ChoiceList
        name="group-delivery"
        variant="group"
        value= {selectedDelivery}
        onChange={(value) => {
          changeDeliveryOption(String(value));
           console.log(
            `onChange event with value: ${value}`,
          );
        }}>
        <Choice secondaryContent={<Text>Free</Text>
          } tertiaryContent={
            <Text>Fast delivery to your front door</Text>
          }
          id="delivery-one">
          <Heading >Standard Delivery</Heading>
        </Choice>
        <Choice
          secondaryContent={<Text>$25</Text>}
          tertiaryContent={
            <Text>Deliver to your room of choice</Text>
          }
          id="delivery-two"><Heading>Room Service </Heading>
        </Choice>
        <Choice
          secondaryContent={ <Text>$75</Text>}
          tertiaryContent={
            <Text>Delivery, assembly, packaging removal & recycling</Text>}
          id="delivery-three"> <Heading >Premium Service </Heading>
        </Choice>
      </ChoiceList>
    </BlockStack>

    <BlockSpacer spacing="loose" />
      <Heading level={2}>Set your prefered date and time</Heading>
      <BlockSpacer spacing="tight" />

      <BlockStack border="base" padding='extraTight' borderRadius="base" spacing='none'>
      <View padding="base">
          <View background="subdued" maxInlineSize="60%" padding='extraTight' borderRadius='base'>
          <Text emphasis='bold' appearance='accent'>{toggleEarlyDateView && 'Earliest'}{!toggleEarlyDateView && 'Preferred'} delivery date</Text>
      
          </View>
          <View padding='extraTight' >
          <Text emphasis='bold' appearance='info'>
                {savedWeekDay}{', '}{savedDateNum}{' '}{savedDateMonth}{' '}
                
                between {deliverTime[0]} {' '}
                and {deliverTime[deliverTime.length-1]}</Text>
          </View>
        <BlockSpacer spacing="tight" />

       <View padding='none'>
       <Button appearance='monochrome' kind='secondary'  overlay={
          <Modal id='date-modal' onOpen={()=>{
              setSelectedDate(savedDate);

            }}
          > 
           <View padding="loose" cornerRadius='base'>
            <InlineLayout> <Heading level={2}> Select Date & Time</Heading>{earliestDate==selectedDate && <View><Text appearance='decorative'>Earliest delivery date</Text></View>}</InlineLayout>
            <BlockSpacer spacing="base" />
              <View border='base' padding='base' borderRadius='base'>
                <DatePicker selected={selectedDate} disabled={disabledDays}  readOnly={false} onChange={(selected)=>{
                console.log(selected)
                if(selected){
                  setSelectedDate(String(selected));
                }
                }}/>   
              </View>
              <BlockSpacer spacing="base" />

              <ChoiceList
                  name="group-date"
                  variant='group'
                  value="first"
                  
                  onChange={(value) => {
                    changeDeliveryOption(String(value))
                    console.log(
                      `onChange event with value: ${value}`,
                    );
                  }}>
                  <Choice secondaryContent={
                      <Text>{selectedDeliveryPrice}</Text>} 
                    id="first">
                    From {' '}
                     {deliverTime[0]} {' to '}
                     {deliverTime[deliverTime.length-1]}{'  '}
       
                  </Choice>
                </ChoiceList>
                <BlockSpacer spacing="base" />

                <InlineLayout columns={'30%'}>
                    <Button kind='primary' onPress={() => {
                      setSavedDate(selectedDate)
                      ui.overlay.close('date-modal')
                      }}>
                        Save
                    </Button>
                    <Button kind='plain'  onPress={() => ui.overlay.close('date-modal')}>
                        Cancel
                    </Button>
                </InlineLayout>
            </View>
            
          </Modal>}>
            <Text>Change</Text>
          </Button>
        </View>           

      </View>
    </BlockStack>

    <BlockSpacer spacing="loose" />
    <Heading level={2}>Choose Protection Options</Heading> 
    <BlockSpacer spacing="tight" />

    <BlockStack>
      <ChoiceList
        name="group-protection"
        variant="group"
        value= {selectedProtection}
        onChange={(value) => {
           changeProtecOption(String(value))
           console.log(
            `onChange event with value: ${value}`,
          );
        }}>
        <Choice secondaryContent={<Text>Free</Text>
          } tertiaryContent={
            <Text>14 day change of mind, standard support</Text>
          }
          id="protection-one">
          <Heading >Standard </Heading>
        </Choice>
        <Choice
          secondaryContent={<Text>$15</Text>}
          tertiaryContent={
            <Text>30 day change of mind, priority support (Most popular)</Text>
          }
          id="protection-two"><Heading>LifelyCare</Heading>
        </Choice>
        <Choice
          secondaryContent={ <Text>$30</Text>}
          tertiaryContent={
            <Text>60 day change of mind, priority support (Best protection)</Text>}
          id="protection-three"> <Heading> LifelyCare+ </Heading>
        </Choice>
      </ChoiceList>
    </BlockStack>
      
    </>);
}