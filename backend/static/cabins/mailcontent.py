


def get_no_html_mail(ctx):
    return f"""
        Hei {ctx["firstname"]}!
      
        Vi har nå reservert { ctx["cabin"] } fra { ctx["fromDate"] } til { ctx["toDate"] }.

        Prisen kommer på { ctx["price"] } kr. Betaling skjer via faktura, se
        vedlegg.

        Hytten skal forlates i minst like god stand som den ble funnet, og
        instrukser for utvask henger ved ytterdøren, samt som vedlegg i denne
        mailen. Dere står selv ansvarlig for eventuelle skader som måtte
        forekomme. Avbestilling uten gebyr må forekomme minst to uker før
        avreise. Vennligst les nøye gjennom reglementet og sjekklisten før
        dere kommer til hytta.


        Ikke nøl med å ta kontakt hvis dere skulle ha spørsmål.
        God tur!

        Med vennlig hilsen,
        Ellie Berglund 
        Bookingansvarlig Hyttestyret,
        Indøkhyttene NTNU
        booking@indokhyttene.no / tlf. 94258380
        https://www.januslinjeforening.no/indokhyttene/
    
    """