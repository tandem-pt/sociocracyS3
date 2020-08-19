
@extends('beautymail::templates.sunny')

@section('content')


    @include ('beautymail::templates.sunny.heading' , [
        'heading' => 'Hello!',
        'level' => 'h1',
    ])

    @include('beautymail::templates.sunny.contentStart')
    <p>
        Hooray !
        You have been invited to bring great value to the organization {{ $organization->name }}.
        Click this button to create an account and participate : 
    </p>
    @include('beautymail::templates.sunny.contentEnd')

    @include('beautymail::templates.sunny.button', [
        	'title' => 'Participate',
        	'link' => $invitation_link
    ])


@stop
