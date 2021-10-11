def get_no_html_mail(ctx, receiver):

    user_content = f"""
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

    admin_content = f"""
        Det har blitt opprettet en booking av { ctx["cabin"] } { ctx["fromDate"] } til { ctx["toDate"] }.

        Prisen kommer på { ctx["price"] } kr.

        Kontakt: { ctx["email"] }, { ctx["firstname"] } { ctx["surname"] }

        Link til admin-sider: INSERT ADMIN :)

        Med vennlig hilsen, Hovedstyrets webkomite
        hswebkom@gmail.com / tlf. 45873401
        indokntnu.no/
    """

    if receiver == "user":
        return user_content
    elif receiver == "admin":
        return admin_content
    else:
        print("receiver must be either admin or user")
        return None
