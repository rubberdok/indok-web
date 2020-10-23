


def get_no_html_mail(ctx):
    return f"""
        Hei {ctx["firstname"]}!\n
      
        Vi har nå reservert { ctx["cabin"] } fra { ctx["fromDate"] } til { ctx["toDate"] }.\n

        Prisen kommer på { ctx["price"] } kr. Betaling skjer via faktura, se
        vedlegg.\n

        Hytten skal forlates i minst like god stand som den ble funnet, og
        instrukser for utvask henger ved ytterdøren, samt som vedlegg i denne
        mailen. Dere står selv ansvarlig for eventuelle skader som måtte
        forekomme. Avbestilling uten gebyr må forekomme minst to uker før
        avreise. Vennligst les nøye gjennom reglementet og sjekklisten før
        dere kommer til hytta.\n


        Ikke nøl med å ta kontakt hvis dere skulle ha spørsmål.\n
        God tur!\n

        Med vennlig hilsen,\n
        Ellie Berglund \n
        Bookingansvarlig Hyttestyret,\n
        Indøkhyttene NTNU\n
        booking@indokhyttene.no / tlf. 94258380\n
        https://www.januslinjeforening.no/indokhyttene/\n
    
    """