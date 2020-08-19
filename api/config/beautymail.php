<?php

return [

    // These CSS rules will be applied after the regular template CSS

    'css' => implode(PHP_EOL, [
        '@import url(http://fonts.googleapis.com/css?family=Roboto);',
        '.button-content .button { 
            background: #1de9b6; 
            color: rgba(0, 0, 0, 0.87);
            border-radius: 8px;
            font-size: 0.9375rem;
            padding: 16px 32px;
            font-weight: 500;
            line-height: 1.75;
            margin-bottom: 64px;
            letter-spacing: 0.02857em;
            text-transform: none;
        }',
        'h1, h2, h3, h4, h5, h6 {
            font-family: Roboto, Helvetica Neue, Helvetica, Arial, Helvetica, serif;
            font-weight: normal;
            color: rgba(0, 0, 0, 0.87);
        }',
    ]),

    'colors' => [
        'highlight' => 'rgba(0, 0, 0, 0.87)',
        'button'    => 'rgba(0, 0, 0, 0.87)',
    ],

    'view' => [
        'senderName'  => null,
        'reminder'    => null,
        'unsubscribe' => null,
        'address'     => null,

        'logo'        => [
            'path'   => '%PUBLIC%/vendor/beautymail/assets/images/sunny/logo.png',
            'width'  => '',
            'height' => '',
        ],

        'twitter'  => null,
        'facebook' => null,
        'flickr'   => null,
    ],

];
