
Build the Site:
--------------------

1. Build User Model
    Base model                              DONE
        Collection                          COLLECTION APP NOT YET BUILT
    Views
        Register User                       DONE
        Register Super User                 DONE
        Login                               DONE
        Logout                              DONE
        View User info                      DONE
        Update User info                    DONE

2. Build Collection Model
    Base Model
        Fields
            EndPoint: https://rebrickable.com/api/v3/lego/sets/
                name
                theme_id
                    Endpoint: https://rebrickable.com/api/v3/lego/themes/
                num_parts
                set_img_url
            EndPoint: https://rebrickable.com/api/v3/lego/sets/13/alternates/
                alternate_version
            difficulty_url
                api call to noun project basd upon num_parts called on create

    Views
        View Collection
            By Piece Count
            By Keyword
            By Theme id/string

